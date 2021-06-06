import { Injectable } from "@angular/core";
import { ProgramClass } from "src/app/interfaces";
import { BehaviorSubject, Observable } from "rxjs";
import { Sort } from "@angular/material/sort";
import { TableService } from "./table.service";
import { SortService } from "./sort.service";
import { ProgramService } from "./program.service";

@Injectable({
  providedIn: "root",
})
export class PoolService {
  private data = new BehaviorSubject<ProgramClass[]>([]);
  selectedCourses: ProgramClass[] = [];

  getData(): Observable<ProgramClass[]> {
    return this.data.asObservable();
  }

  constructor(
    private tableService: TableService,
    private sortService: SortService,
    private programService: ProgramService
  ) {
    this.programService.filteredCourses.subscribe((courses) => {
      courses = this.sortService.sortData(courses);
      this.data.next(courses);
    });

    this.programService.selectedCodes.subscribe((selectedCodes) => {
      this.selectedCourses.forEach((course) => {
        if (!selectedCodes.includes(course.code)) {
          this.removeFromSelection(course);
        }
      });
    });

    this.sortService.smartFilter.subscribe(() => {
      this.sort();
    });
  }

  /**
   * Adds or removes a course to or from the selection and table.
   *
   * @param   {ProgramClass[]}  data    All courses
   * @param   {ProgramClass}    course  Course to be toggled
   * @param   {boolean}  value   True if going to be added
   *
   * @return  {ProgramClass[]}          All courses but updated
   */
  private toggleSelected(
    data: ProgramClass[],
    course: ProgramClass,
    value: boolean
  ): ProgramClass[] {
    /* Set selected to value, update behaviour subject */
    const i = data.findIndex((x) => x === course);
    data[i].selected = value;
    return data;
  }

  /**
   * Checks all courses can be selected or not.
   * Updates 'canBeSelected' field
   *
   * @param   {ProgramClass[]}  data  All courses
   *
   * @return  {ProgramClass[]}             All courses but updated
   */
  private checkCanBeSelected(data: ProgramClass[]): ProgramClass[] {
    data = data.map((course) => {
      if (!course.selected) {
        course.canBeSelected = this.tableService.canAddCourse(course);
      }
      return course;
    });
    return data;
  }

  /**
   * Sorting logic.
   *
   * @param   {Sort}  sort  MatSort
   */
  sort(sort?: Sort) {
    let data = this.data.value;
    data = this.sortService.sortData(data, sort);
    this.data.next(data);
  }

  /**
   * Load data to pool from inner sourecs.
   *
   * @param   {ProgramClass[]}  data       All courses
   * @param   {number}   sortDelay  Delay of loading, for router event to finish
   */
  update(data: ProgramClass[], sortDelay: number = 0) {
    setTimeout(() => {
      data = this.sortService.sortData(data);
      this.data.next(data);
    }, sortDelay);
  }

  /**
   * Adds a course to the selection and table
   *
   * @param   {ProgramClass}  course  Course to be added
   */
  addToSelection(course: ProgramClass) {
    this.selectedCourses.push(course);
    this.tableService.addCourseToTable(course);
    this.programService.addCourseToSelection(course);
  }

  /**
   * Removes a course from the selection and table
   *
   * @param   {ProgramClass}  course  Course to be removed
   */
  removeFromSelection(course: ProgramClass) {
    this.selectedCourses.splice(
      this.selectedCourses.findIndex((x) => x === course),
      1
    );
    this.tableService.removeCourseFromTable(course);
    this.programService.removeCourseFromSelection(course);
  }

  /**
   * Empties pool data
   */
  clear() {
    this.data.next([]);
    this.selectedCourses = [];
  }
}
