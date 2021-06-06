import { Injectable } from '@angular/core';
import { Department, Filter, ProgramClass } from 'src/app/interfaces';

export interface FilterParams {
  courses: ProgramClass[];
  selectedCourses: ProgramClass[];
  filter: Filter;
  userDepartment: Department;
}

@Injectable({
  providedIn: 'any',
})
export class FilterService {
  constructor() {}

  /**
   * Checks if two class codes are similar
   *
   * "BLG 102" === "BLG 102"
   * "BLG 102E" === "BLG 102"
   * "BLG 102" === "BLG 102E"
   *
   * @param   {string}  code1  First code
   * @param   {string}  code2  Second code
   *
   * @return  {boolean}        Either similar or not
   */
  private isCodeSimilar(code1: string, code2: string): boolean {
    if (code1 === code2) return true;
    if (
      code1[code1.length - 1] === 'E' &&
      code1.substring(0, code1.length - 1) === code2
    )
      return true;
    if (
      code2[code2.length - 1] === 'E' &&
      code2.substring(0, code2.length - 1) === code1
    )
      return true;
    return false;
  }

  /**
   * Filterer method. Takes a course, decides whether it should be visible or not.
   *
   * @param   {Class}    course  Course to be checked
   *
   * @return  {boolean}          Can be visible or not
   */
  private filterer(
    course: ProgramClass,
    selectedCourses: ProgramClass[],
    {
      hideAlternatives,
      hideConflicts,
      hideMajorRestricted,
      codes,
      days,
    }: Filter,
    userDepartment: string
  ): boolean {
    if (course.selected) {
      return true;
    }

    if (!codes.includes(course.code)) {
      return false;
    }

    if (course.days.some((day) => !days.includes(day))) {
      return false;
    }

    if (hideMajorRestricted && !course.restricts.includes(userDepartment)) {
      return false;
    }

    if (
      hideAlternatives &&
      selectedCourses.findIndex((x) =>
        this.isCodeSimilar(x.code, course.code)
      ) >= 0
    ) {
      return false;
    }

    if (hideConflicts && !course.canBeSelected) {
      return false;
    }

    return true;
  }

  /**
   * Takes course list, returns filtered course list
   *
   * @param   {Class[]}  data  Course array
   *
   * @return  {Class[]}        Filtered course array
   */
  filterData = ({
    courses,
    selectedCourses,
    filter,
    userDepartment,
  }: FilterParams): ProgramClass[] => {
    return courses.filter((course) =>
      this.filterer(course, selectedCourses, filter, userDepartment.abbrv)
    );
  };

  // setSelectedCourses(courses: ProgramClass[]): void {
  //   this.$selectedCourses.next(courses);
  // }

  // toggleRestricted() {
  //   this.hideRestricted.next(!this.hideRestricted.value);
  // }

  // toggleConflicted() {
  //   this.hideConflicts.next(!this.hideConflicts.value);
  // }

  // toggleDuplicated() {
  //   this.hideDuplicates.next(!this.hideDuplicates.value);
  // }
}
