import { Component, OnInit, Injectable } from "@angular/core";
import { ClassDataService } from "src/app/services/class-data.service";
import { Class } from "../../interfaces";

interface Slot {
  days: string;
  hours: number;
}

@Component({
  selector: "app-week-table",
  templateUrl: "./week-table.component.html",
  styleUrls: ["./week-table.component.css"],
})
@Injectable({
  providedIn: "root",
})
export class WeekTableComponent implements OnInit {
  constructor(private classService: ClassDataService) {}

  getColumnOfDay(day: string) {
    if (day === "Pazartesi") return 1;
    if (day === "Salı") return 2;
    if (day === "Çarşamba") return 3;
    if (day === "Perşembe") return 4;
    if (day === "Cuma") return 5;
  }

  getRowOfHour(hours: number) {
    return hours - 7;
  }

  getHoursArray(hoursString: string) {
    const startingHour = parseInt(hoursString.slice(0, 2));
    const endingHour = parseInt(hoursString.slice(5, 7));
    let hoursArray = [];
    for (let i = startingHour; i < endingHour; i++) {
      hoursArray.push(i);
    }
    return hoursArray;
  }

  ngOnInit(): void {
    this.classService.classes.subscribe((newClasses) => {
      if (newClasses.length > 0) {
        const redSlots = this.classService.getRedSlots();
        const yellowSlots = this.classService.getYellowSlots();
        this.fillTable(newClasses, redSlots, yellowSlots);
      }
    });
  }

  fillTable(
    classes: Array<Class>,
    redSlots: Array<Slot>,
    yellowSlots: Array<Slot>
  ) {
    const table: any = document.querySelector("#week");

    // Empty table first
    for (let i = 1; i < 6; i++) {
      for (let j = 1; j < 10; j++) {
        const tableCell = table.rows[j].cells[i];
        tableCell.innerHTML = "";
        tableCell.classList.remove("table-success");
        tableCell.classList.remove("table-warning");
      }
    }

    // Then fill with necessary things
    classes.forEach((thisClass) => {
      if (thisClass.selected) {
        for (let i = 0; i < thisClass.days.length; i++) {
          const days = thisClass.days[i];
          const hoursArray = this.getHoursArray(thisClass.hours[i]);
          hoursArray.forEach((hours) => {
            const tableCell =
              table.rows[this.getRowOfHour(hours)].cells[
                this.getColumnOfDay(days)
              ];
            tableCell.innerHTML = thisClass.code;
            tableCell.classList.add("table-success");
          });
        }
      }
    });

    if (yellowSlots) {
      yellowSlots.forEach((yellowSlot) => {
        const tableCell =
          table.rows[this.getRowOfHour(yellowSlot.hours)].cells[
            this.getColumnOfDay(yellowSlot.days)
          ];
        tableCell.classList.add("table-warning");
      });
    }

    // Paint yellow if there is duplicate
    classes.forEach((thisClass) => {
      if (thisClass.selected) {
        for (let i = 0; i < thisClass.days.length; i++) {
          const days = thisClass.days[i];
          const hoursArray = this.getHoursArray(thisClass.hours[i]);
          hoursArray.forEach((hours) => {
            const tableCell =
              table.rows[this.getRowOfHour(hours)].cells[
                this.getColumnOfDay(days)
              ];
            tableCell.innerHTML = thisClass.code;
            tableCell.classList.add("table-success");
          });
        }
      }
    });

    // Give error on slots if necessary
    if (redSlots) {
      redSlots.forEach((redSlot) => {
        const tableCell =
          table.rows[this.getRowOfHour(redSlot.hours)].cells[
            this.getColumnOfDay(redSlot.days)
          ];
        tableCell.classList.add("table-danger");
        setTimeout(() => {
          tableCell.classList.remove("table-danger");
        }, 1000);
      });
    }
  }
}
