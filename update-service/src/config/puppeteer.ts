import puppeteer, { Browser, EvaluateFn, Page } from "puppeteer";

export default class CustomPuppeteer {
  page: Page;
  browser: Browser;

  async build() {
    this.browser = await puppeteer.launch({
      headless: true,
      product: "chrome",
      executablePath: "/usr/bin/chromium",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    this.page = (await this.browser.pages())[0];
  }

  async destroy() {
    await this.page.close();
    await this.browser.close();
  }

  async parseTable(params: { selector: string; links: boolean }) {
    return await this.page.evaluate(
      (selector, links) => {
        const table = document.querySelector(selector);

        if (!table) return selector;

        const rows: HTMLTableRowElement[] = Array.from(table.querySelectorAll("tr"));

        return Array.from(rows, (row: HTMLTableRowElement) => {
          const columns = row.querySelectorAll("td");
          return Array.from(columns, (td) => {
            if (links && td.getElementsByTagName("a").length > 0) {
              return {
                href: td.getElementsByTagName("a")[0].href,
                text: td.innerText,
              };
            } else {
              return td.innerText;
            }
          });
        });
      },
      params.selector,
      params.links
    );
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: "networkidle2" });
  }

  async wait() {
    await this.page.waitForNavigation({ waitUntil: "networkidle2" }),
      await new Promise((r) => setTimeout(r, 200)); // Sleep
  }

  url() {
    return this.page.url();
  }

  async eval(fn: EvaluateFn, params?: any) {
    return await this.page.evaluate(fn, params);
  }
}
