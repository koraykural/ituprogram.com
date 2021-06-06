import { Injectable } from '@angular/core';
import { CellData, ProgramClass, TimeSlot, DaysEnum } from 'src/app/interfaces';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectProgram } from '../state/selectors';
import { map, pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'any',
})
export class TableService {
  tableChanged: Subject<boolean> = new Subject();
  tableData$: Observable<CellData[][]> = this.store.pipe(
    select(selectProgram),
    pluck('selectedCourses'),
    map((courses) => {
      let slots: (TimeSlot & { course: ProgramClass })[] = [];
      courses.forEach((course) => {
        slots = [
          ...slots,
          ...this.parseCourseTimeslots(course).map((slot) => ({
            ...slot,
            course,
          })),
        ];
      });
      return slots;
    }),
    map((slots) => {
      const cells = this.setupEmptyCells();
      slots.forEach(({ hour, day, course }) => {
        cells[hour][day].state = 'ok';
        cells[hour][day].course = course;
      });
      return cells;
    })
  );

  /**
   * Creates empty weekly table
   */
  constructor(private store: Store<AppState>) {
    // this.clearTable();
  }

  /**
   * Parses a hour string to hour index array.
   *
   * For example: "0930/1130" -> [1, 2]
   *
   * @param   {string[]}  hour  Hour string in ProgramClass interface
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
   * @param   {ProgramClass}   course  Course to be parsed.
   *
   * @return  {TimeSlot[]}      Array of day and hour indexes.
   */
  private parseCourseTimeslots(course: ProgramClass): TimeSlot[] {
    const timeslots: TimeSlot[] = [];

    for (let i = 0; i < course.days.length; i++) {
      const day = DaysEnum[course.days[i]];
      const hours = this.parseHourString(course.hours[i]);
      hours.forEach((hour) => {
        timeslots.push({ day, hour });
      });
    }

    return timeslots;
  }

  private setupEmptyCells = (): CellData[][] => {
    const cells: CellData[][] = [[], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 9; j++) {
        cells[j][i] = {
          state: 'empty',
          course: null,
          day: i,
          hour: j,
        };
      }
    }
    return cells;
  };
}
