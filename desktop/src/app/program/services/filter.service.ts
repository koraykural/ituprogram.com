import { Injectable } from "@angular/core";
import { Class } from "app/interfaces";
import { PlanService } from "app/state/plan.service";
import { TableService } from "./table.service";
import { ProgramService } from "./program.service";
import { BehaviorSubject } from "rxjs";
import { combineLatest } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  userMajor: string;

  hideRestricted = new BehaviorSubject<boolean>(true);
  hideConflicts = new BehaviorSubject<boolean>(true);
  hideDuplicates = new BehaviorSubject<boolean>(true);

  constructor(
    private planService: PlanService,
    private tableService: TableService,
    private programService: ProgramService
  ) {
    this.userMajor = this.planService.basePlan.value.subject.abrv;

    this.programService.courses.subscribe((courses) => {
      const filteredCourses = this.filterData(courses);
      this.programService.setFilteredCourses(filteredCourses);
    });

    this.$filtersChanged.subscribe(() => {
      const courses = this.programService.courses.value;
      const filteredCourses = this.filterData(courses);
      this.programService.setFilteredCourses(filteredCourses);
    });
  }

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
      code1[code1.length - 1] === "E" &&
      code1.substring(0, code1.length - 1) === code2
    )
      return true;
    if (
      code2[code2.length - 1] === "E" &&
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
  private filterer(course: Class): boolean {
    if (course.selected) {
      return true;
    }

    if (
      this.hideRestricted.value &&
      !course.restricts.includes(this.userMajor)
    ) {
      return false;
    }

    const selectedCourses = this.programService.selectedCourses.value;
    if (
      this.hideDuplicates.value &&
      selectedCourses.findIndex((x) =>
        this.isCodeSimilar(x.code, course.code)
      ) >= 0
    ) {
      return false;
    }

    if (this.hideConflicts.value && !course.canBeSelected) {
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
  filterData(data: Class[]): Class[] {
    data = data.map((course) => {
      if (!course.selected) {
        course.canBeSelected = this.tableService.canAddCourse(course);
      }
      if (course.selected === undefined || course.selected === null) {
        course.selected = false;
      }
      return course;
    });

    data = data.filter(this.filterer.bind(this));

    return data;
  }

  toggleRestricted() {
    this.hideRestricted.next(!this.hideRestricted.value);
  }

  toggleConflicted() {
    this.hideConflicts.next(!this.hideConflicts.value);
  }

  toggleDuplicated() {
    this.hideDuplicates.next(!this.hideDuplicates.value);
  }

  get $filtersChanged() {
    return combineLatest([
      this.hideRestricted,
      this.hideConflicts,
      this.hideDuplicates,
    ]);
  }
}
