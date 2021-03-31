import Handler from "./handler";
import Informer from "./informer";
import bot from "../config/telegram";

export const informer = new Informer(bot);
export default bot;
const handler = new Handler();

/* ------------------------ Response time middleware ------------------------ */
bot.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const response_time = Date.now() - start;
  console.log(`(Response Time: ${response_time})`);
});

/* ----------------------------- Global Commands ---------------------------- */
bot.start((ctx) => {
  ctx.reply(
    "<b>Kontenjan Botuna hoşgeldin</b>\n\n" +
      "Seni hayalindeki derse kavuşturmak için yardımcı olabilirim.\n\n" +
      "Bana seçmek istediğin dersin CRN'sini söylersen, her 15 dakikada bir o " +
      "derse kayıtlı kişi sayısını kontrol edip eğer birisi dersi bırakırsa " +
      "sana haber verebilirim. /izle komutuyla bir dersi izlemeye başlayabilirsin.\n\n" +
      "(Henüz test aşamasındayım.)",
    { parse_mode: "HTML" }
  );
});

/* ---------------------------------- izle ---------------------------------- */
bot.command("izle", handler.crn_ile_izle.bind(handler));

/* ------------------------------ CRN ile izle ------------------------------ */
bot.action("crnizle-1", (ctx) => handler.crn_izle_listener(ctx, 1));
bot.action("crnizle-2", (ctx) => handler.crn_izle_listener(ctx, 2));
bot.action("crnizle-3", (ctx) => handler.crn_izle_listener(ctx, 3));
bot.action("crnizle-4", (ctx) => handler.crn_izle_listener(ctx, 4));
bot.action("crnizle-5", (ctx) => handler.crn_izle_listener(ctx, 5));
bot.action("crnizle-6", (ctx) => handler.crn_izle_listener(ctx, 6));
bot.action("crnizle-7", (ctx) => handler.crn_izle_listener(ctx, 7));
bot.action("crnizle-8", (ctx) => handler.crn_izle_listener(ctx, 8));
bot.action("crnizle-9", (ctx) => handler.crn_izle_listener(ctx, 9));
bot.action("crnizle-0", (ctx) => handler.crn_izle_listener(ctx, 0));

/* --------------------------------- İzleme --------------------------------- */
bot.command("izleme", handler.crn_izleme);
bot.action(/\bcrnizleme-[0-9]{5}\b/, handler.crn_izleme_callback);

/* ---------------------------------- Durum --------------------------------- */
bot.command("durum", handler.durum);
