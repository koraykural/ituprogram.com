import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Class } from "app/interfaces";

@Injectable({
  providedIn: "root",
})
export class InfoService {
  hoveredCourse = new BehaviorSubject<Class>(null);

  constructor() {}

  mouseEntered(course: Class) {
    this.hoveredCourse.next(course);
  }
  clearHovered() {
    this.hoveredCourse.next(null);
  }
}
