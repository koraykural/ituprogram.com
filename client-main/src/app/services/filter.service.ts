import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Class } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  isModalOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  filter = {
    code: [{ id: "", amount: 0, checked: true }],
    days: [{ id: "", checked: true }],
    buildings: [{ id: "", checked: true }],
    major: true,
  };
  numOfUnfiltered = 0;

  onFilterClick = new EventEmitter<any>();
  classSelectModal = new EventEmitter<any>();
  createProgramModal = new EventEmitter<any>();
  major: BehaviorSubject<string> = new BehaviorSubject("");

  constructor() {}

  createFilter(classes: Array<Class>) {
    this.major.next(localStorage.getItem("subject"));
    // Remove initial empty filters
    this.filter = { code: [], days: [], buildings: [], major: true };
    classes.forEach((thisClass) => {
      // Check if class code presents in filter
      let codePresent = false;
      for (let i = 0; i < this.filter.code.length; i++) {
        const el = this.filter.code[i];
        if (el.id === thisClass.code) {
          // If so increment amount of it
          el.amount++;
          codePresent = true;
        }
        // If there is a lot of the same class, hide it initially
        if (el.amount > 6) {
          el.checked = false;
        }
        // No longer search filter for this class
        if (codePresent) break;
      }
      // If couldn't find in filter, add it
      if (!codePresent) {
        this.filter.code.push({ id: thisClass.code, amount: 1, checked: true });
      }

      // Check if buildings present in filter
      for (let i = 0; i < thisClass.buildings.length; i++) {
        const buildings = thisClass.buildings[i];
        let buildingPresent = false;
        for (let j = 0; j < this.filter.buildings.length; j++) {
          const el = this.filter.buildings[j];
          if (el.id === buildings) {
            buildingPresent = true;
            break;
          }
        }
        // If not, add it
        if (!buildingPresent) {
          this.filter.buildings.push({ id: buildings, checked: true });
        }
      }
    });
    // Create days array manually
    this.filter.days = [
      { id: "Pazartesi", checked: true },
      { id: "Salı", checked: true },
      { id: "Çarşamba", checked: true },
      { id: "Perşembe", checked: true },
      { id: "Cuma", checked: true },
    ];

    // Publish new filter
    this.getNumUnfiltered(classes);
  }

  toggleFilter(id: string, filterType: string) {
    if (filterType === "major") {
      this.filter.major = !this.filter.major;
      return;
    }
    for (let i = 0; i < this.filter[filterType].length; i++) {
      const el = this.filter[filterType][i];
      if (id == el.id) {
        this.filter[filterType][i].checked = !el.checked;
        break;
      }
    }
  }

  isNotFiltered(thisClass: Class) {
    // Look for code filters
    for (let i = 0; i < this.filter.code.length; i++) {
      const el = this.filter.code[i];
      if (thisClass.code === el.id) {
        if (!el.checked) return false;
        break;
      }
    }

    // Look for days filters
    for (let i = 0; i < this.filter.days.length; i++) {
      const el = this.filter.days[i];
      // For each days of thisClass
      for (let j = 0; j < thisClass.days.length; j++) {
        const days = thisClass.days[j];
        if (days === el.id) {
          if (!el.checked) return false;
          break;
        }
      }
    }

    // Look for buildings filters
    for (let i = 0; i < thisClass.buildings.length; i++) {
      const buildings = thisClass.buildings[i];
      for (let j = 0; j < this.filter.buildings.length; j++) {
        const el = this.filter.buildings[j];
        if (el.id === buildings) {
          if (!el.checked) return false;
          break;
        }
      }
    }

    // Look for major filter
    if (this.filter.major)
      if (
        thisClass.restricts.length > 0 &&
        !thisClass.restricts.includes(this.major.value)
      )
        return false;

    // If passes all checks, show it
    return true;
  }

  getNumUnfiltered(classes: Array<Class>) {
    this.numOfUnfiltered = 0;
    classes.forEach((thisClass) => {
      if (this.isNotFiltered(thisClass)) this.numOfUnfiltered++;
    });
    return this.numOfUnfiltered;
  }
}
