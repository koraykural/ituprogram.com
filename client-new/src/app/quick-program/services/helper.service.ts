import { Injectable } from '@angular/core';
import { DaysEnum, ProgramClass, TimeSlot } from 'src/app/interfaces';

@Injectable({
  providedIn: 'any',
})
export class HelperService {
  constructor() {}

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

  constructTimeslots(courses: ProgramClass[]): TimeSlot[] {
    let slots: TimeSlot[] = [];
    courses.forEach((course) => {
      slots = [...slots, ...this.parseCourseTimeslots(course)];
    });
    return slots;
  }

  setSelectedProperty(
    courses: ProgramClass[],
    selectedCourses: ProgramClass[]
  ): ProgramClass[] {
    return courses.map((course) => ({
      ...course,
      selected: selectedCourses.includes(course),
    }));
  }

  /**
   * Decides if a course can be added to the table or not
   *
   * @param   {ProgramClass}    course  Course to be checked
   *
   * @return  {boolean}          If can be added
   */
  canAddCourse(course: ProgramClass, occupiedSlots: TimeSlot[]): boolean {
    return !this.parseCourseTimeslots(course).some(
      (slot) =>
        occupiedSlots.findIndex(
          ({ day, hour }) => day === slot.day && hour === slot.hour
        ) >= 0
    );
  }

  setCanBeSelectedProperty(
    courses: ProgramClass[],
    selectedCourses: ProgramClass[]
  ): ProgramClass[] {
    const occupiedSlots = this.constructTimeslots(selectedCourses);
    return courses.map((course) => ({
      ...course,
      canBeSelected:
        course.selected || this.canAddCourse(course, occupiedSlots),
    }));
  }

  checkSelectedCourses(
    courses: ProgramClass[],
    selectedCourses: ProgramClass[]
  ): ProgramClass[] {
    return selectedCourses.filter(
      (course) => courses.findIndex((c) => c.code === course.code) >= 0
    );
  }
}
