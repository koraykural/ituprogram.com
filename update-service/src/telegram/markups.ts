import { Markup } from "telegraf";
import { CallbackButton } from "telegraf/typings/markup";
import { IClass } from "../models/class.model";
import { IKontenjan } from "../models/kontenjan.model";

export const crnizleKeypad = Markup.inlineKeyboard([
  [
    Markup.callbackButton("1", "crnizle-1"),
    Markup.callbackButton("2", "crnizle-2"),
    Markup.callbackButton("3", "crnizle-3"),
  ],
  [
    Markup.callbackButton("4", "crnizle-4"),
    Markup.callbackButton("5", "crnizle-5"),
    Markup.callbackButton("6", "crnizle-6"),
  ],
  [
    Markup.callbackButton("7", "crnizle-7"),
    Markup.callbackButton("8", "crnizle-8"),
    Markup.callbackButton("9", "crnizle-9"),
  ],
  [Markup.callbackButton("0", "crnizle-0")],
]).extra();

export const izleCommandKeypad = Markup.keyboard(["CRN ile izle", "Kod ile izle"])
  .oneTime()
  .resize()
  .extra();

export const commands = Markup.keyboard(["/izle", "/izleme", "/durum"]).oneTime().resize().extra();

export const untrackList = (classes: IKontenjan[]) => {
  let buttons: CallbackButton[][] = [];
  classes.forEach((x) => {
    const thisClass = x.class as IClass;
    buttons.push([Markup.callbackButton(`${thisClass.code} - ${x.crn}`, `crnizleme-${x.crn}`)]);
  });
  return Markup.inlineKeyboard(buttons).oneTime().resize().extra();
};
