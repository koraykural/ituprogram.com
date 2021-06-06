import { Injectable } from '@angular/core';
import { ProgramClass, Day, Sort, DaysEnum } from 'src/app/interfaces';

@Injectable({
  providedIn: 'any',
})
export class SortService {
  constructor() {}

  private constructAlternativesMap(courses: ProgramClass[]): {
    [key: string]: number;
  } {
    const courseTimesMap: { [key: string]: string[] } = {};
    courses.forEach((course) => {
      if (courseTimesMap[course.code] === undefined) {
        courseTimesMap[course.code] = [];
      }
      let slotStr = '';
      course.days.forEach((day, index) => {
        slotStr += day + course.hours[index];
      });
      courseTimesMap[course.code].push(slotStr);
    });
    let alternativeCount: { [key: string]: number } = {};
    for (const key in courseTimesMap) {
      alternativeCount[key] = [...new Set(courseTimesMap[key])].length;
    }
    return alternativeCount;
  }

  sortData(data: ProgramClass[], { by, order }: Sort): ProgramClass[] {
    let alternativeCount: { [key: string]: number } = {};
    if (by === 'alternative-count') {
      alternativeCount = this.constructAlternativesMap(data);
    }

    data = data.sort((a: ProgramClass, b: ProgramClass): number => {
      if (a.selected && !b.selected) return -1;
      if (b.selected && !a.selected) return 1;
      if (!a.canBeSelected && b.canBeSelected) return 1;
      if (!b.canBeSelected && a.canBeSelected) return -1;

      if (by === 'alternative-count') {
        if (alternativeCount[a.code] > alternativeCount[b.code]) return 1;
        if (alternativeCount[a.code] < alternativeCount[b.code]) return -1;
        else return this.compareText(a, b, 'code');
      }

      const isAsc = order === 'asc';
      const ord = this.compareBy(by, a, b);
      return isAsc ? ord : ord * -1;
    });

    return data;
  }

  private compareBy(
    identifier: string,
    a: ProgramClass,
    b: ProgramClass
  ): number {
    switch (identifier) {
      case 'crn':
        return this.compareNumber(a, b, 'crn');
      case 'code':
        return this.compareText(a, b, 'code');
      case 'name':
        return this.compareText(a, b, 'name');
      case 'days':
        return this.compareDays(a, b);
      case 'alternative-count':
        return this.compareDays(a, b);
      case 'hours':
        return this.compareText(a, b, 'hours');
      default:
        return 0;
    }
  }

  private compareNumber(
    a: ProgramClass,
    b: ProgramClass,
    identifier: 'crn'
  ): number {
    return a[identifier] - b[identifier];
  }

  private compareText(
    a: ProgramClass,
    b: ProgramClass,
    identifier: keyof ProgramClass
  ): number {
    if (a[identifier] === b[identifier]) return 0;
    if (a[identifier] > b[identifier]) return 1;
    else return -1;
  }

  private compareDays(a: ProgramClass, b: ProgramClass): number {
    const dayComparison = DaysEnum[a.days[0]] - DaysEnum[b.days[0]];

    if (dayComparison === 0) {
      const hourComparison = a.hours[0] > b.hours[0];
      return hourComparison ? 1 : -1;
    } else {
      return dayComparison;
    }
  }
}
