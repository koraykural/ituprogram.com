import { ObjectId } from "mongodb";
import { ClassSchema, KontenjanSchema, PlanSchema, UpdateSchema, CodeSchema } from "./config/mongo";
import CustomPuppeteer from "./config/puppeteer";
import { codeLetters } from "./consts";
import { codesCollection, getUniqueClasses, ScrapeOpenedClasses } from "./helpers/classes";
import { emptyCrnCheck } from "./telegram/database";

export const UpdateStandart = async (page: CustomPuppeteer, scrapeAll: boolean) => {
  let letterList: string[] = [];
  if (scrapeAll) {
    letterList = codeLetters;
  } else {
    letterList = await createLetterList();
    console.log(letterList);
  }
  for (let i = 0; i < letterList.length; i++) {
    const codeLetter = letterList[i];

    // Scrape page of codeLetter
    let classes = [];
    try {
      classes = await ScrapeOpenedClasses(page, codeLetter);
    } catch (error) {
      console.log(`${codeLetter} skipping: Error occured while scraping`);
      UpdateSchema.updateCode(codeLetter, "Bazı dersler güncellenemedi.", false);
      continue;
    }

    // Skip if no class exists
    if (classes.length < 1) {
      console.log(`${codeLetter} skipping: No class found`);
      UpdateSchema.updateCode(codeLetter, "Ders bulunamadı.", false);
      continue;
    }

    let promises: any[] = [];
    let emptyCrns: string[] = [];
    for (let i = 0; i < classes.length; i++) {
      const el = classes[i];

      if (el.enrolled < el.capacity) {
        emptyCrns.push(el.crn);
      }
      try {
        promises.push(ClassSchema.updateByCrn(el.crn, el));
      } catch (err) {
        console.log(err);
      }
    }

    emptyCrnCheck(emptyCrns);
    await Promise.all(promises)
      .then(() => {
        console.log(`${codeLetter} scraped ${classes.length} courses`);
        UpdateSchema.updateCode(
          codeLetter,
          `Sorunsuz güncellendi. ${classes.length} dersin verisi yenilendi.`,
          true
        );
      })
      .catch((error) => {
        console.error(error);
        UpdateSchema.updateCode(codeLetter, "Bazı dersler güncellenemedi.", false);
      });
  }
};

export const UpdateDetailed = async (page: CustomPuppeteer) => {
  await ClassSchema.deleteMany({});
  await new Promise((r) => setTimeout(r, 3000)); // Sleep
  await UpdateStandart(page, true);
  await new Promise((r) => setTimeout(r, 20 * 1000)); // Sleep 20 seconds
  updatePlanIsOpened();
  updateCodes();
};

const createLetterList = async () => {
  try {
    const list: string[] = [];
    const docs = await KontenjanSchema.find({}).populate("class", "code").lean();

    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      if (!doc.class || doc.class instanceof ObjectId) {
        continue;
      }
      const code = doc.class.code;
      const letter = code.substr(0, 3);
      if (list.findIndex((x) => x === letter) < 0) {
        list.push(letter);
      }
    }

    return list;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const updatePlanIsOpened = async (): Promise<any> => {
  const plans = await PlanSchema.find({});
  const uniqueClasses = await getUniqueClasses();

  for (let i = 0; i < plans.length; i++) {
    let plan = plans[i];

    for (let j = 0; j < plan.groups.length; j++) {
      const group = plans[i].groups[j];
      for (let k = 0; k < group.items.length; k++) {
        const item = plans[i].groups[j].items[k];
        const index = uniqueClasses.findIndex((x) => x === item.code);
        if (index >= 0) plans[i].groups[j].items[k].isOpened = true;
        else plans[i].groups[j].items[k].isOpened = false;
      }
    }

    await PlanSchema.updateOne(
      { link: plan.link },
      { $set: { groups: plan.groups } },
      {},
      (err: any) => {
        if (err) console.log(err);
        else console.log(`${plan.link} is opened updated.`);
      }
    );
  }
};

const updateCodes = async () => {
  const allClasses = await ClassSchema.find();
  await new Promise((r) => setTimeout(r, 1000)); // Sleep
  await CodeSchema.deleteMany({});
  const openCodes = await codesCollection(allClasses);
  await CodeSchema.insertMany(openCodes);
  UpdateSchema.updateOne(
    {},
    {
      $set: {
        opened_classes: {
          situation: "Sorunsuz güncellendi.",
          last_update: new Date(),
        },
        plans: {
          situation: "Sorunsuz güncellendi.",
          last_update: new Date(),
        },
      },
    }
  );
};
