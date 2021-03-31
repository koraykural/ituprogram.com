import Telegraf from "telegraf";

export default new Telegraf(process.env.BOT_TOKEN as string);
