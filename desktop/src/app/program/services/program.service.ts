import { Injectable } from "@angular/core";
import { GroupProgram, GroupPlan, ItemProgram, Class } from "app/interfaces";
import { ApiService } from "app/shared/services/api.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProgramService {
  // Plan filters
  maxGrade = 4.1;
  isNotOpenedHidden = false;

  // Program data
  id: string;
  planData = new BehaviorSubject<GroupProgram[]>([]);
  selectedCodes = new BehaviorSubject<string[]>([]);
  courses = new BehaviorSubject<Class[]>([]);
  filteredCourses = new BehaviorSubject<Class[]>([]);
  selectedCourses = new BehaviorSubject<Class[]>([]);

  constructor(private apiService: ApiService) {}

  setPlanData(data: GroupPlan[]) {
    const groups: GroupProgram[] = data.map((group) => {
      return {
        label: group.label,
        items: group.items.map((item) => {
          if (item.isSubGroup) {
            const item2return: ItemProgram = {
              code: item.code,
              name: item.name,
              grade: item.grade,
              credits: item.credits,
              isSubGroup: true,
              subItems: item.subItems.map((subItem) => {
                const isOpened = Math.random() > 0.3;
                return {
                  name: subItem.name,
                  code: subItem.code,
                  isOpened,
                  disabled: !isOpened,
                  selected: false,
                };
              }),
            };
            return item2return;
          } else {
            const item2return: ItemProgram = {
              code: item.code,
              name: item.name,
              grade: item.grade,
              credits: item.credits,
              isOpened: Math.random() > 0.3,
              selected: false,
              isSubGroup: false,
            };
            return item2return;
          }
        }),
      };
    });

    this.planData.next(groups);
  }

  addCode(code: string) {
    const index = this.selectedCodes.value.findIndex((x) => x === code);
    if (index < 0) {
      let selectedCodes = this.selectedCodes.value;
      selectedCodes.push(code);
      this.selectedCodes.next(selectedCodes);
    }
    this.apiService.getClasses([code]).subscribe((classes) => {
      const allClasses = this.courses.value.concat(classes);
      this.courses.next(allClasses);
    });
  }

  removeCode(code: string) {
    let selectedCodes = this.selectedCodes.value;
    selectedCodes = selectedCodes.filter((x) => x !== code);
    this.selectedCodes.next(selectedCodes);

    let classData = this.courses.value;
    classData = classData.filter((x) => x.code !== code);
    this.courses.next(classData);
  }

  setFilteredCourses(courses: Class[]) {
    this.filteredCourses.next(courses);
  }

  addCourseToSelection(course: Class) {
    let courses = this.courses.value;
    const index = courses.findIndex((x) => x === course);
    course.selected = true;
    courses[index] = course;

    let selectedCourses = this.selectedCourses.value;
    selectedCourses.push(course);

    this.selectedCourses.next(selectedCourses);
    this.courses.next(courses);
  }

  removeCourseFromSelection(course: Class) {
    let selectedCourses = this.selectedCourses.value;
    selectedCourses = selectedCourses.filter((x) => x !== course);

    let courses = this.courses.value;
    const index = courses.findIndex((x) => x === course);
    course.selected = false;
    courses[index] = course;

    this.selectedCourses.next(selectedCourses);
    this.courses.next(courses);
  }

  reset() {
    this.planData.next([]);
    this.selectedCodes.next([]);
    this.selectedCourses.next([]);
    this.courses.next([]);
    this.filteredCourses.next([]);
  }
}
