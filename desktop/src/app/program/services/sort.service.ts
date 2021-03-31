import { Injectable } from "@angular/core";
import { Sort, SortDirection } from "@angular/material/sort";
import { Class, Days } from "app/interfaces";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SortService {
  smartFilter = new BehaviorSubject<boolean>(true);
  direction: SortDirection = "";
  active: string = "";
  isAsc: boolean = null;

  get lastSort(): Sort {
    return {
      direction: this.direction,
      active: this.active,
    };
  }

  constructor() {}

  private setLastSort(sort: Sort) {
    this.direction = sort.direction;
    this.active = sort.active;
  }

  sortData(data: Class[], sort?: Sort): Class[] {
    if (sort) {
      this.setLastSort(sort);
    }

    const alternativeCount: { [key: string]: number } = {};

    if (this.smartFilter.value) {
      data.forEach((course) => {
        if (!course.canBeSelected) return;

        if (alternativeCount[course.code] === undefined) {
          alternativeCount[course.code] = 1;
        } else {
          alternativeCount[course.code]++;
        }
      });
    }

    data = data.sort((a: Class, b: Class): number => {
      if (a.selected && !b.selected) return -1;
      if (b.selected && !a.selected) return 1;
      if (!a.canBeSelected && b.canBeSelected) return 1;
      if (!b.canBeSelected && a.canBeSelected) return -1;

      if (this.smartFilter.value) {
        if (alternativeCount[a.code] > alternativeCount[b.code]) return 1;
        if (alternativeCount[a.code] < alternativeCount[b.code]) return -1;
      }

      if (!sort) {
        sort = this.lastSort;
      }

      if (!sort.active || sort.direction === "") return 0;

      const { active, direction } = sort;
      const isAsc = direction === "asc";
      const ord = this.compareBy(active, a, b);
      return isAsc ? ord : ord * -1;
    });

    return data;
  }

  compareBy(identifier: string, a: Class, b: Class): number {
    switch (identifier) {
      case "crn":
        return this.compareNumber(a, b, "crn");
      case "code":
        return this.compareText(a, b, "code");
      case "name":
        return this.compareText(a, b, "name");
      case "buildings":
        return this.compareText(a, b, "buildings");
      case "days":
        return this.compareDays(a, b);
      case "hours":
        return this.compareText(a, b, "hours");
      default:
        return 0;
    }
  }

  compareNumber(a: Class, b: Class, identifier: string): number {
    return a[identifier] - b[identifier];
  }

  compareText(a: Class, b: Class, identifier: string): number {
    if (a[identifier] === b[identifier]) return 0;
    if (a[identifier] > b[identifier]) return 1;
    else return -1;
  }

  compareDays(a: Class, b: Class): number {
    const dayComparison = Days[a.days[0]] - Days[b.days[0]];

    if (dayComparison === 0) {
      const hourComparison = a.hours[0] > b.hours[0];
      return hourComparison ? 1 : -1;
    } else {
      return dayComparison;
    }
  }
}
