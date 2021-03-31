import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { IClass } from "../models/class.model";
import { IKontenjan } from "../models/kontenjan.model";

export default class Informer {
  constructor(private bot: Telegraf<TelegrafContext>) {}

  sendBasicMessage(chat_id: string, message: string) {
    this.bot.telegram.sendMessage(chat_id, message);
  }

  sendHTMLMessage(chat_id: string, HTML: string) {
    this.bot.telegram.sendMessage(chat_id, HTML, { parse_mode: "HTML" });
  }

  sendGoodNews(doc: IKontenjan) {
    const classData = doc.class as IClass;
    console.log(`Good news sent to ${doc.chat_id} for ${classData.code}`);
    this.sendHTMLMessage(
      doc.chat_id,
      `<b>Boş yer var!</b>\n\n<b>${classData.code} - ${doc.crn}</b>\n` +
        `Kayıtlı/Kontejan: ${classData.enrolled}/${classData.capacity}\n\n` +
        `<a href="http://ssb.sis.itu.edu.tr:9000/pls/PROD/twbkwbis.P_GenMenu?name=bmenu.P_MainMnu">ITU SIS</a>`
    );
  }
}
