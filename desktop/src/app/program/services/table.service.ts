import { Injectable } from "@angular/core";
import { CellData, Class, TimeSlot, Days } from "app/interfaces";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TableService {
  tableChanged: Subject<boolean> = new Subject();
  tableData: CellData[][] = [[], [], [], [], [], [], [], [], []];

  /**
   * Creates empty weekly table
   */
  constructor() {
    this.clearTable();
  }

  /**
   * Parses a hour string to hour index array.
   *
   * For example: "0930/1130" -> [1, 2]
   *
   * @param   {string[]}  hour  Hour string in Class interface
   *
   * @return  {number[]}        Indexes of the hours
   */
  private parseHourString(hour: string): number[] {
    const first = parseInt(hour.substring(0, 2));
    const second = parseInt(hour.substring(5, 7));
    let hours: number[] = [];
    for (let i = first; i < second; i++) {
      hours.push(i - 8);
    }
    return hours;
  }

  /**
   * Takes a class and returns index of the hours
   *
   * For example:
   * ["Pazartesi"]["0830/1030"] -> [{day: 0, hour: 0}, {day: 0, hour: 1}]
   *
   * @param   {Class}   course  Course to be parsed.
   *
   * @return  {TimeSlot[]}      Array of day and hour indexes.
   */
  private parseCourseTimeslots(course: Class): TimeSlot[] {
    const timeslots: TimeSlot[] = [];

    for (let i = 0; i < course.days.length; i++) {
      const day = Days[course.days[i]];
      const hours = this.parseHourString(course.hours[i]);
      hours.forEach((hour) => {
        timeslots.push({ day, hour });
      });
    }

    return timeslots;
  }

  /**
   * Empties a cell
   *
   * @param   {[type]}    day   Day index
   * @param   {TimeSlot}  hour  Hour index
   *
   * @return  {void}
   */
  private clearCell({ day, hour }: TimeSlot): void {
    this.tableData[hour][day] = {
      state: "empty",
      course: null,
      day,
      hour,
    };
  }

  /**
   * Makes a cell red for a short time as an error indicator.
   *
   * @param   {[type]}    day   Day index
   * @param   {TimeSlot}  hour  Hour index
   *
   * @return  {void}
   */
  private setCellError({ day, hour }: TimeSlot): void {
    // const oldState = this.tableData[hour][day].state;
    // this.tableData[hour][day].state = "error";
    // setTimeout(() => {
    //   this.tableData[hour][day].state = oldState;
    //   this.tableChanged.next(true);
    // }, 1000);
    // this.tableChanged.next(true);
  }

  /**
   * Sets a course to a table cell.
   *
   * Warning! No check will be done to the cell.
   *
   * @param   {number}    day     Day index of cell
   * @param   {number}    hour    Hour index of cell
   * @param   {Class}     course  Course to be set
   *
   * @return  {void}
   */
  private setCellCourse(day: number, hour: number, course: Class) {
    this.tableData[hour][day].state = "ok";
    this.tableData[hour][day].course = course;
    this.tableChanged.next(true);
  }

  /**
   * Checks if a cell is empty or not
   *
   * @param   {number}   day   Day index
   * @param   {number}   hour  Hour index
   *
   * @return  {boolean}        Is empty
   */
  private isCellEmpty({ day, hour }: TimeSlot): boolean {
    return this.tableData[hour][day].state === "empty";
  }

  /**
   * Empties the whole table
   */
  clearTable(): void {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 9; j++) {
        this.clearCell({ day: i, hour: j });
      }
    }
    this.tableChanged.next(true);
  }

  /**
   * Decides if a course can be added to the table or not
   *
   * @param   {Class}    course  Course to be checked
   *
   * @return  {boolean}          If can be added
   */
  canAddCourse(course: Class): boolean {
    const timeslots = this.parseCourseTimeslots(course);

    let isEmpty = true;

    timeslots.forEach((timeslot) => {
      if (!this.isCellEmpty(timeslot)) {
        isEmpty = false;
      }
    });

    return isEmpty;
  }

  /**
   * Adds a course to the weekly table
   *
   * @param   {Class}    course  Course to add
   *
   * @return  {boolean}          Is added or not.
   */
  addCourseToTable(course: Class): boolean {
    const timeslots = this.parseCourseTimeslots(course);

    if (!this.canAddCourse(course)) {
      timeslots.forEach((timeslot) => {
        if (!this.isCellEmpty(timeslot)) {
          this.setCellError(timeslot);
        }
      });
      return false;
    }

    timeslots.forEach((timeslot) => {
      this.setCellCourse(timeslot.day, timeslot.hour, course);
    });

    this.tableChanged.next(true);
    return true;
  }

  /**
   * Removes a course from weekly table
   *
   * @param   {Class}  course  Course to be removed
   *
   * @return  {void}
   */
  removeCourseFromTable(course: Class): void {
    const timeslots = this.parseCourseTimeslots(course);
    timeslots.forEach((timeslot) => {
      this.clearCell(timeslot);
    });
    this.tableChanged.next(true);
  }
}
