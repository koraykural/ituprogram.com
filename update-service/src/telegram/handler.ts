import { TelegrafContext } from "telegraf/typings/context";
import { crnizleKeypad, untrackList } from "./markups";
import { informer } from "./app";
import { startTracking, status, stopTracking, getListOfTracked } from "./database";

interface State {
  [key: string]: any;
  chat_id: number;
  CRN: string;
  keypad: number;
  expires: number;
}

export default class Handler {
  private state: State = {} as State;

  async crn_ile_izle(ctx: TelegrafContext) {
    try {
      const m = await ctx.reply("CRN..............", crnizleKeypad);

      const { message } = ctx.update;
      if (!message || !message.from || !message.from.username) {
        return;
      }

      this.state[message.from.username] = {
        chat_id: m.chat.id,
        CRN: "",
        keypad: m.message_id,
        expires: Date.now() + 1000 * 60,
      };
    } catch (err) {
      console.log(err);
      ctx.reply("Bir hata oluştu...");
    }
  }

  crn_izle_listener(ctx: TelegrafContext, num: number) {
    const { callback_query } = ctx.update as any;
    if (!callback_query || !callback_query.data || !callback_query.from.username) {
      return;
    }

    const username = callback_query.from.username;

    if (!this.state[username]) {
      return ctx.answerCbQuery("Hata");
    }
    ctx.answerCbQuery();

    this.state[username].CRN += num.toString();
    this.state[username].expires = Date.now() + 1000 * 60;

    const CRN = this.state[username].CRN;

    if (CRN.length === 1) {
      ctx.telegram.editMessageText(
        this.state[username].chat_id,
        this.state[username].keypad,
        "",
        `CRN............${CRN}`,
        crnizleKeypad
      );
    } else if (CRN.length < 5) {
      let dots = "";
      for (let i = 0; i < 14 - CRN.length * 2; i++) dots += ".";
      ctx.telegram.editMessageText(
        this.state[username].chat_id,
        this.state[username].keypad,
        "",
        `CRN${dots}${CRN}`,
        crnizleKeypad
      );
    } else if (CRN.length == 5) {
      ctx.telegram.deleteMessage(this.state[username].chat_id, this.state[username].keypad);
      startTracking({ crn: CRN, chat_id: this.state[username].chat_id });
      delete this.state[username];
    }
  }

  async crn_izleme(ctx: TelegrafContext) {
    const { message } = ctx.update;
    if (!message || !message.from) {
      return;
    }

    const chat_id = message.from.id.toString();
    try {
      const classes = await getListOfTracked(chat_id);
      if (classes.length < 1) {
        informer.sendBasicMessage(chat_id, "İzlenilen dersin bulunmuyor.");
        return;
      }
      ctx.reply("İzlemeyi bırakmak istediğin dersi seç.", untrackList(classes));
    } catch (err) {
      console.log(err);
      informer.sendBasicMessage(chat_id, "Bir hata oluştu.");
      return;
    }
  }

  crn_izleme_callback(ctx: TelegrafContext) {
    ctx.answerCbQuery();
    const { callback_query } = ctx.update as any;
    if (!callback_query || !callback_query.data) {
      return;
    }

    const cbq = callback_query.data;
    const crn = cbq.substr(cbq.indexOf("-") + 1);
    const chat_id = callback_query.from.id.toString();
    stopTracking({ chat_id, crn });
  }

  durum(ctx: TelegrafContext) {
    const message = ctx.update.message;
    if (!message || !message.from) {
      return;
    }
    const chat_id = String(message.from.id);
    status(chat_id);
  }
}
