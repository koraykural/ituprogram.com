import { Injectable } from "@angular/core";
import {
  Grade,
  PlanData,
  SelectedPlan,
  PlanItem,
  PlanItemMulti,
} from "app/interfaces";
import { ApiService } from "app/shared/services/api.service";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PlanService {
  basePlan = new BehaviorSubject<SelectedPlan | null>(null);
  planData = new BehaviorSubject<PlanData | null>(null);
  optCourses = new BehaviorSubject<PlanItem[] | null>([]);

  statistics: {
    totalCredits: number;
    takenCredits: number;
    achievedCredits: number;
    achievedPoints: number;
    remainingCredits: number;
    GPA: number;
  };

  get zeroStatistics() {
    return {
      totalCredits: 0,
      takenCredits: 0,
      achievedCredits: 0,
      achievedPoints: 0,
      remainingCredits: 0,
      GPA: 0,
    };
  }

  get mergedgroups() {
    return this.planData.value.concat({
      label: "Ek Dersler",
      items: this.optCourses.value,
    });
  }

  constructor(private apiService: ApiService) {
    this.setFromLocalStorage();

    this.planData.subscribe((data) => {
      console.log(data);
      if (data) {
        localStorage.setItem("planData", JSON.stringify(data));
        this.calculateStatistics();
      } else {
        localStorage.removeItem("planData");
        this.statistics = this.zeroStatistics;
      }
    });

    this.optCourses.subscribe((data) => {
      if (data) {
        localStorage.setItem("optCourses", JSON.stringify(data));
        this.calculateStatistics();
      } else {
        localStorage.removeItem("optCourses");
        this.calculateStatistics();
      }
    });

    this.basePlan.pipe(filter((val) => val !== null)).subscribe((basePlan) => {
      const localData = localStorage.getItem("basePlan");
      if (localData !== JSON.stringify(basePlan)) {
        console.log("new plan is selected");

        localStorage.setItem("basePlan", JSON.stringify(basePlan));
        this.apiService.getPlanData(basePlan).subscribe((data) => {
          this.planData.next(data);
        });
      }
    });
  }

  setFromLocalStorage() {
    const basePlan = localStorage.getItem("basePlan");
    if (basePlan) {
      const planData = localStorage.getItem("planData");
      this.planData.next(JSON.parse(planData));
      this.basePlan.next(JSON.parse(basePlan));
      const optCourses = localStorage.getItem("optCourses");
      this.optCourses.next(JSON.parse(optCourses) || []);
    }
  }

  setGrade(grade: Grade, groupLabel: string, itemName: string) {
    if (groupLabel !== "Ek Dersler") {
      const groups = this.planData.value;
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group.label === groupLabel) {
          for (let j = 0; j < group.items.length; j++) {
            const item = group.items[j];
            if (
              (item as PlanItem).name === itemName ||
              (item as PlanItemMulti).label === itemName
            ) {
              item.grade = grade;
            }
          }
        }
      }
      this.planData.next(groups);
    } else {
      const items = this.optCourses.value;
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        if (item.name === itemName) {
          items[j].grade = grade;
        }
      }
      this.optCourses.next(items);
    }
  }

  setOptional(groupLabel: string, subgroupLabel: string, itemName: string) {
    const groups = this.planData.value;
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (group.label === groupLabel) {
        for (let j = 0; j < group.items.length; j++) {
          const item = group.items[j];
          if ("label" in item && item.label === subgroupLabel) {
            for (let k = 0; k < item.items.length; k++) {
              const subItem = item.items[k];
              if (subItem.name === itemName) {
                (groups[i].items[j] as PlanItemMulti).items[k].selected = true;
              } else {
                (groups[i].items[j] as PlanItemMulti).items[k].selected = false;
              }
            }
          }
        }
      }
    }
    this.planData.next(groups);
  }

  addOptCourse(code: string, name: string, credits: number) {
    const current = this.optCourses.value;
    current.push({
      code,
      name,
      credits,
      grade: null,
    });
    this.optCourses.next(current);
  }

  removeOptCourse(code: string) {
    const current = this.optCourses.value;
    // Remove element from current
    const index = current.findIndex((course) => course.code === code);
    if (index !== -1) current.splice(index, 1);
    this.optCourses.next(current);
  }

  calculateStatistics() {
    this.statistics = this.zeroStatistics;
    const data = this.mergedgroups;
    console.log(data);

    const stats = this.zeroStatistics;

    if (!data) return;

    data.forEach((group) => {
      group.items.forEach((item) => {
        stats.totalCredits += item.credits;
        if (item.grade !== null) {
          stats.achievedCredits += item.credits;
          stats.achievedPoints += item.credits * item.grade;
          stats.takenCredits += item.credits;
        }
      });
    });

    stats.GPA = stats.achievedPoints / stats.takenCredits || 0.0;
    this.statistics = stats;
  }

  resetAll() {
    this.statistics = this.zeroStatistics;
    this.resetLocalStorage();
    this.basePlan.next(null);
    this.planData.next(null);
    this.optCourses.next(null);
  }

  resetLocalStorage() {
    localStorage.removeItem("basePlan");
    localStorage.removeItem("planData");
    localStorage.removeItem("optCourses");
  }
}
