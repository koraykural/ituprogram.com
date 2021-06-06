import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgramClass } from 'src/app/interfaces';

@Injectable({
  providedIn: 'any',
})
export class InfoService {
  hoveredCourse = new BehaviorSubject<ProgramClass | null>(null);

  constructor() {}

  mouseEntered(course: ProgramClass) {
    this.hoveredCourse.next(course);
  }
  clearHovered() {
    this.hoveredCourse.next(null);
  }
}
