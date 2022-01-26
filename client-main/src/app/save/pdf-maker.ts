import { Injectable } from "@angular/core";
import { WeekTableComponent } from "../create-program/week-table/week-table.component";
import { Class } from "../interfaces";
import pdfMake from "pdfmake/build/pdfmake.min";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: "root",
})
export class PdfMaker {
  classes: Array<Class>;
  totalCredits = 0;
  id: string;

  // Color palette
  palette = [
    "#fdf4bd",
    "#ffe6f1",
    "#ffb99e",
    "#c2def3",
    "#c5bbe0",
    "#f0f1f5",
    "#d2eddc",
    "#b3f9ef",
    "#fcdfd7",
    "#f3add1",
    "#c5fdb6",
  ];
  colorForName = [];

  constructor(private weekTable: WeekTableComponent) {}

  generatePdf(classes: Array<Class>, id: string) {
    this.totalCredits = 0;
    this.classes = classes;
    this.id = id;

    const documentDefinition = this.getDocumentDefinition();
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.getBlob((blob) => {
      let blobURL = URL.createObjectURL(blob);
      if (window.navigator && (window.navigator as any)?.msSaveOrOpenBlob) {
        (window.navigator as any)?.msSaveOrOpenBlob(
          blob,
          "Ders Programı (ituprogram.com).pdf"
        );
      } else {
        var objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, "_blank");
      }
    });
  }

  getDocumentDefinition() {
    return {
      info: {
        title: "Ders Programı (ituprogram.com)",
        author: "ituprogram.com",
      },
      content: [
        // Header
        { text: "ituprogram.com", style: "header" },

        // Weekly table
        {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              layout: this.weeklyTableLayout,
              table: {
                widths: ["auto", "auto", "auto", "auto", "auto", "auto"],
                headerRows: 1,
                body: this.generataWeeklyTable(),
              },
            },
            { width: "*", text: "" },
          ],
        },

        // Classes table
        {
          layout: this.classesTableLayout,
          table: {
            widths: [35, 60, "*", 70, 70, 60, 30, 27],
            headerRows: 1,
            body: this.generateClassesTable(),
          },
          margin: [0, 30, 0, 0],
        },
        // Total credits
        {
          text: [
            { text: "Toplam kredi: ", bold: true },
            { text: this.totalCredits },
          ],
          margin: [0, 5, 3, 0],
          alignment: "right",
        },

        // Information about how to continue on where you left
        { text: "Kaldığın yerden devam etmek istersen:", style: "subHeader" },
        {
          layout: {
            vLineWidth: () => {
              return 0;
            },
            hLineWidth: () => {
              return 0;
            },
            paddingTop: () => {
              return 4;
            },
            paddingBottom: () => {
              return 4;
            },
            paddingLeft: () => {
              return 5;
            },
            paddingRight: () => {
              return 5;
            },
          },
          table: {
            widths: ["auto", "auto"],
            body: [
              [
                { text: "PIN numaran:", bold: true, margin: [15, 0, 0, 0] },
                this.id,
              ],
              [
                { text: "Link:", bold: true, margin: [15, 0, 0, 0] },
                { text: "http://ituprogram.com/id/" + this.id },
              ],
            ],
          },
        },
      ],
      defaultStyle: {
        fontSize: 11,
      },
      styles: {
        header: {
          alignment: "center",
          color: "#007bff",
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 20],
        },
        subHeader: {
          fontSize: 16,
          bold: true,
          margin: [0, 30, 0, 10],
        },
      },
    };
  }

  generataWeeklyTable() {
    // Array of obj as {hour: number, day: number, name: string}
    let weekTableArray = [];

    // Create weekTableArray
    this.classes.forEach((thisClass) => {
      this.totalCredits += thisClass.credits;
      // Assign a color to each class
      this.colorForName.push(thisClass.name);
      for (let i = 0; i < thisClass.days.length; i++) {
        const days = thisClass.days[i];
        const hoursArray = this.weekTable.getHoursArray(thisClass.hours[i]);
        hoursArray.forEach((hours) => {
          weekTableArray.push({
            day: this.weekTable.getColumnOfDay(days),
            hour: this.weekTable.getRowOfHour(hours),
            name: thisClass.name,
          });
        });
      }
    });

    // Hold table in 2D array
    let weekTable = [];

    // First row of weekly table
    weekTable.push([
      "",
      { text: "Pazartesi", fontSize: 11 },
      { text: "Salı", fontSize: 11 },
      { text: "Çarşamba", fontSize: 11 },
      { text: "Perşembe", fontSize: 11 },
      { text: "Cuma", fontSize: 11 },
    ]);

    // Create table row by row, hour for hour i=1 is 8.30
    for (let i = 1; i < 10; i++) {
      // Create row and at last push it to table
      let row = [];

      // First cell is header, 9.30 10.30 etc
      row.push({ text: i + 7 + ".30", noWrap: true, fontSize: 10 });

      // Search each day for this hour
      for (let j = 1; j < 6; j++) {
        let emptyCell = true;

        // Check if there is any class in this cell
        weekTableArray.forEach((slot) => {
          // If so, fill it with class name and background color
          if (slot.day == j && slot.hour == i) {
            let index = this.colorForName.findIndex((x) => x === slot.name);
            row.push({
              text: this.shorthenLongWords(slot.name),
              fontSize: 11,
              fillColor: this.palette[index],
            });
            emptyCell = false;
          }
        });
        // If not, leave it empty
        if (emptyCell) row.push("");
      }
      // Push row to table
      weekTable.push(row);
    }
    // Return WeeklyTable
    return weekTable;
  }

  weeklyTableLayout = {
    paddingTop: () => {
      return 4;
    },
    paddingBottom: () => {
      return 4;
    },
    paddingLeft: () => {
      return 5;
    },
    paddingRight: () => {
      return 5;
    },
    hLineWidth: () => {
      return 0.2;
    },
    vLineWidth: () => {
      return 0.2;
    },
    hLineColor: () => {
      return "#999999";
    },
    vLineColor: () => {
      return "#999999";
    },
  };

  generateClassesTable() {
    let classesTable = [];
    const headerRow = [
      { text: "CRN", bold: true },
      { text: "Ders Kodu", bold: true },
      { text: "Ders Adı", bold: true },
      { text: "Gün", bold: true },
      { text: "Saat", bold: true },
      { text: "Öğretim Yöntemi", bold: true },
      { text: "Bina", bold: true },
      { text: "Kredi", bold: true, alignment: "right" },
    ];
    classesTable.push(headerRow);
    this.classes.forEach((el) => {
      let index = this.colorForName.findIndex((x) => x === el.name);
      let color = this.palette[index];
      classesTable.push([
        { text: el.crn, fillColor: color },
        { text: el.code, fillColor: color },
        { text: el.name, fillColor: color },
        { text: el.days.join("\n"), fillColor: color },
        { text: el.hours.join("\n"), fillColor: color },
        { text: el.teachingMethod, fillColor: color },
        { text: el.buildings.join("\n"), fillColor: color },
        { text: el.credits, fillColor: color, alignment: "right" },
      ]);
    });
    return classesTable;
  }

  classesTableLayout = {
    hLineWidth: () => {
      return 0;
    },
    vLineWidth: () => {
      return 0;
    },
    paddingTop: () => {
      return 5;
    },
    paddingBottom: () => {
      return 5;
    },
    hLineColor: () => {
      return "#999999";
    },
    vLineColor: () => {
      return "#999999";
    },
  };

  // Max word length -> 20
  // Cropt to        -> 16
  shorthenLongWords(str: string) {
    let arr = str.trim().split(" ");
    let resArr = [];
    arr.forEach((el) => {
      if (el.length > 20) {
        el = el.slice(0, 16);
        el += "...";
      }
      resArr.push(el);
    });
    return resArr.join(" ");
  }
}
