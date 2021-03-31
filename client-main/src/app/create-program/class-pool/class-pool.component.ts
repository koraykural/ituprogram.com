import { Component, OnInit } from "@angular/core";
import { HostListener } from "@angular/core";
import { FilterService } from "src/app/services/filter.service";
import { ClassDataService } from "src/app/services/class-data.service";
import { Class, Filter } from "../../interfaces";

@Component({
  selector: "app-class-pool",
  templateUrl: "./class-pool.component.html",
  styleUrls: ["./class-pool.component.css"],
})
export class ClassPoolComponent implements OnInit {
  classes: Array<Class>;
  @HostListener("window:resize", ["$event"])
  onResize() {
    this.setHeightOffPoolElement();
  }

  tableHeaders = [
    { shown: "Kod", identifier: "code" },
    { shown: "Ders", identifier: "name" },
    { shown: "Gün", identifier: "days" },
    { shown: "Saat", identifier: "hours" },
    { shown: "Bina", identifier: "buildings" },
    { shown: "CRN", identifier: "crn" },
  ];
  poolTableMaxHeight: number;
  filter: Filter;
  sortedBy = "";
  sortTopTimeout: NodeJS.Timeout;

  constructor(
    private modalService: FilterService,
    private classService: ClassDataService
  ) {}

  ngOnInit(): void {
    this.setHeightOffPoolElement();

    // Get filter and sort acordingly
    this.modalService.onFilterClick.subscribe((isOpen: boolean) => {
      if (!isOpen) {
        this.filter = this.modalService.filter;
        this.sortPoolBy("code");
      }
    });

    // Get classes
    this.classService.classes.subscribe((newClasses) => {
      this.classes = newClasses;
    });
    this.sortPoolBy("code");
  }

  setHeightOffPoolElement() {
    const screenHeight = window.innerHeight;
    const bottomButtons: HTMLDivElement = document.querySelector(
      ".bottom-buttons"
    );
    const weekTable: HTMLDivElement = document.querySelector(".week-table");
    this.poolTableMaxHeight =
      screenHeight - (bottomButtons.offsetHeight + weekTable.offsetHeight + 18);
  }

  rowClick(crn: number) {
    this.classService.rowClick(crn);
    clearTimeout(this.sortTopTimeout);
    this.sortTopTimeout = setTimeout(this.sortSelectedToTop.bind(this), 3000);
  }

  sort(value: string) {
    if (value.includes("Kod")) {
      this.sortPoolBy("code");
    }
    if (value.includes("Ders")) {
      this.sortPoolBy("name");
    }
    if (value.includes("Saat")) {
      this.sortPoolBy("hours");
    }
    if (value.includes("Gün")) {
      this.sortPoolBy("days");
    }
    if (value.includes("Bina")) {
      this.sortPoolBy("buildings");
    }
    if (value.includes("CRN")) {
      this.sortPoolBy("crn");
    }
  }

  sortSelectedToTop() {
    this.classes.sort((a, b) => {
      if (a.selected) {
        return -1;
      }
      if (b.selected) {
        return 1;
      }
    });
  }

  sortPoolBy(identifier: string) {
    const daysOfWeek = ["pazartesi", "salı", "çarşamba", "perşembe", "cuma"];
    if (identifier != this.sortedBy) {
      this.classes.sort((a, b) => {
        let nameA, nameB;
        if (
          identifier == "days" ||
          identifier == "hours" ||
          identifier == "buildings"
        ) {
          nameA = a[identifier][0].toLowerCase();
          nameB = b[identifier][0].toLowerCase();
        } else if (identifier == "crn") {
          nameA = a[identifier];
          nameB = b[identifier];
        } else {
          nameA = a[identifier].toLowerCase();
          nameB = b[identifier].toLowerCase();
        }

        if (identifier == "days") {
          if (daysOfWeek.indexOf(nameA) < daysOfWeek.indexOf(nameB)) return -1;
          else return 1;
        } else {
          if (nameA < nameB)
            //sort string ascending
            return -1;
          else nameA > nameB;
          return 1;
        }

        return 0; //default return value (no sorting)
      });
      this.sortedBy = identifier;
    } else {
      this.classes.sort((a, b) => {
        let nameA, nameB;
        if (
          identifier == "days" ||
          identifier == "hours" ||
          identifier == "buildings"
        ) {
          nameA = a[identifier][0].toLowerCase();
          nameB = b[identifier][0].toLowerCase();
        } else if (identifier == "crn") {
          nameA = a[identifier];
          nameB = b[identifier];
        } else {
          nameA = a[identifier].toLowerCase();
          nameB = b[identifier].toLowerCase();
        }
        if (nameA > nameB)
          //sort string ascending
          return -1;
        if (nameA < nameB) return 1;
        return 0; //default return value (no sorting)
      });
      this.sortedBy = "";
      this.sortSelectedToTop();
    }
  }

  isNotFiltered(thisClass: Class) {
    return this.modalService.isNotFiltered(thisClass);
  }
}
