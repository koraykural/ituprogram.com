import { KontenjanSchema, ClassSchema } from "../config/mongo";
import { IKontenjan } from "../models/kontenjan.model";
import { informer } from "./app";

export const startTracking = async (params: { crn: string; chat_id: string }) => {
  const { crn, chat_id } = params;

  // Get current status
  let thisClass;
  try {
    thisClass = await ClassSchema.findOne({ crn })
      .lean()
      .select({ capacity: 1, enrolled: 1, code: 1 });
    if (thisClass) {
      informer.sendHTMLMessage(
        chat_id,
        `<b>${thisClass.code} - ${crn}</b>\nKayıtlı/Kontejan: ${thisClass.enrolled}/${thisClass.capacity}`
      );
      if (thisClass.enrolled < thisClass.capacity) {
        informer.sendBasicMessage(chat_id, "Derste boş yer bulunuyor. Ders izlenmiyor.");
        return;
      }
    } else {
      informer.sendBasicMessage(chat_id, `${crn} CRN'li dersi bulamadım. Ders izlenmiyor.`);
      return;
    }
  } catch (err) {
    console.log(err);
    informer.sendBasicMessage(chat_id, "Bir hata oluştu. Ders izlenmiyor.");
    return;
  }

  // Update KontenjanSchema
  try {
    const q = { crn, chat_id, class: thisClass._id };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
    await KontenjanSchema.findOneAndUpdate(q, q, options).lean().exec();
  } catch (err) {
    console.log(err);
    informer.sendBasicMessage(chat_id, "Bir hata oluştu. Ders izlenmiyor.");
    return;
  } finally {
    informer.sendBasicMessage(chat_id, `${crn} CRN'li dersi izlemeye başlıyorum`);
  }

  // Send current status as message
};

export const getListOfTracked = (chat_id: string): Promise<IKontenjan[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const classes = await KontenjanSchema.find({ chat_id })
        .populate("class", "code capacity enrolled")
        .exec();
      resolve(classes);
    } catch (err) {
      reject(err);
    }
  });
};

export const stopTracking = async (params: { crn: string; chat_id: string }) => {
  const { crn, chat_id } = params;

  try {
    const q = { crn, chat_id };
    const deleted = await KontenjanSchema.findOneAndDelete(q);
    if (deleted) {
      informer.sendBasicMessage(chat_id, `${deleted.crn} CRN'li dersi artık izlemiyorum.`);
    } else {
      informer.sendBasicMessage(
        chat_id,
        `${crn} CRN'li ders izlediklerin listesinde bulunmuyordu zaten.`
      );
    }
  } catch (err) {
    console.log(err);
    informer.sendBasicMessage(chat_id, "Bir hata oluştu.");
    return;
  }
};

export const status = async (chat_id: string) => {
  try {
    const classes = await KontenjanSchema.find({ chat_id })
      .populate("class", "code capacity enrolled")
      .lean()
      .exec();
    if (classes.length < 1) {
      informer.sendBasicMessage(chat_id, "İzlenilen dersin bulunmuyor.");
    } else {
      let html = "";
      classes.forEach((x) => {
        const thisClass = x.class as { code: string; capacity: number; enrolled: number };
        html += `<b>${thisClass.code} - ${x.crn}</b>\nKayıtlı/Kontejan: ${thisClass.enrolled}/${thisClass.capacity}\n\n`;
      });
      informer.sendHTMLMessage(chat_id, html);
    }
  } catch (err) {
    console.log(err);
    informer.sendBasicMessage(chat_id, "Bir hata oluştu.");
  }
};

export const emptyCrnCheck = async (crnList: string[]) => {
  const kontenjans = await KontenjanSchema.find({ crn: { $in: crnList } }).populate(
    "class",
    "code capacity enrolled"
  );

  if (kontenjans.length < 1) {
    return;
  }

  kontenjans.forEach((doc) => {
    try {
      informer.sendGoodNews(doc);
      stopTracking({ crn: doc.crn, chat_id: doc.chat_id });
    } catch (err) {
      console.log(err);
    }
  });
};
