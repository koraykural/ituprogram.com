import { ClassSchema } from "../config/mongo";
import CustomPuppeteer from "../config/puppeteer";
import { classesUrlBase } from "../consts";
import { IClass } from "../models/class.model";
import { ICode } from "../models/code.model";

export const ScrapeOpenedClasses = async (page: CustomPuppeteer, codeLetter: string) => {
  try {
    if (page.url() !== classesUrlBase) {
      await page.goto(classesUrlBase);
      await new Promise((r) => setTimeout(r, 500)); // Sleep
    }

    // Set selection and reload page with proper table
    await page.eval((codeLetter: string) => {
      const select = document.querySelector('select[name="derskodu"]') as HTMLSelectElement;
      if (!select) {
        return undefined;
      }
      let options: HTMLLIElement[] | HTMLOptionElement[] = Array.from(
        select.children
      ) as HTMLOptionElement[];
      const optIndex = options.findIndex((opt) => opt.value === codeLetter);

      options[optIndex].selected = true;
      const submitButton = document.querySelector(`input[name="B1"]`) as HTMLButtonElement;
      submitButton.click();
    }, codeLetter);

    await page.wait();
    const tableData = await page.parseTable({ selector: "table", links: false });

    // Remove header rows
    tableData.shift();
    tableData.shift();

    // No class exists
    if (tableData.length < 1) {
      throw "Empty table";
    }

    const classes = [] as IClass[];
    for (let i = 0; i < tableData.length; i++) {
      const rowData = tableData[i];

      // Declare class object
      const thisClass = {} as IClass;

      // Parse rowData to class object
      thisClass.crn = rowData[0];
      thisClass.code = rowData[1];
      thisClass.name = rowData[2];
      thisClass.lecturer = rowData[3];
      thisClass.buildings = rowData[4].split("\n");
      thisClass.buildings.pop();
      thisClass.days = rowData[5].split("\n");
      thisClass.days.pop();
      thisClass.hours = rowData[6].split("\n");
      thisClass.hours.pop();
      thisClass.capacity = parseInt(rowData[8]);
      thisClass.enrolled = parseInt(rowData[9]);
      thisClass.restricts = rowData[11].split(", ");
      thisClass.preReqs = rowData[12].split("\n");

      thisClass.preReqs = thisClass.preReqs.filter((el) => {
        return el != "";
      });

      // Add class to the array
      classes.push(thisClass);
    }

    return classes;
  } catch (err) {
    console.log(codeLetter, err);
    return [];
  }
};

export const getUniqueClasses = async (): Promise<string[]> => {
  const classes = await ClassSchema.find({});
  const uniqueClasses: string[] = [];

  classes.forEach((x) => {
    if (!uniqueClasses.includes(x.code)) uniqueClasses.push(x.code);
  });

  return uniqueClasses;
};

export const codesCollection = async (classes: IClass[]) => {
  let codeMap: ICode[] = [];
  classes.forEach((el) => {
    el.code.trim();
    const letter = el.code.substring(0, el.code.indexOf(" "));
    const course = el.code.substring(el.code.indexOf(" ") + 1, el.code.length) + " - " + el.name;
    const index = codeMap.findIndex((x) => x.letter == letter);
    if (index == -1) {
      codeMap.push({ letter, course: [course] });
    } else {
      if (!codeMap[index].course.includes(course)) {
        codeMap[index].course.push(course);
      }
    }
  });

  return codeMap;
};
