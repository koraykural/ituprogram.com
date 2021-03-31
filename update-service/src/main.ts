import * as dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import Puppeteer from "./config/puppeteer";
import { UpdateStandart, UpdateDetailed } from "./update";
import bot from "./telegram/app";

console.log("Puppeteer instance is being created...");
const page = new Puppeteer();
page.build();

console.log("Telegram Bot is starting...");
bot.launch();

// Every two day at 01.00
cron.schedule("3 1 * * *", () => {
  console.log("Update started...");
  UpdateDetailed(page);
});

// // Every one hour
// cron.schedule("3 * * * *", () => {
//   console.log("Update started...");
//   UpdateStandart(page, true);
// });

// // Every 15 minutes
// cron.schedule("3,18,33,48 * * * *", () => {
//   console.log("Update started...");
//   UpdateStandart(page, false);
// });

// setTimeout(() => {
//   UpdateDetailed(page);
// }, 3000);
