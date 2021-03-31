import { Component, OnInit } from "@angular/core";
import { Grade, PlanItem } from "app/interfaces";
import { ApiService } from "app/shared/services/api.service";
import { PlanService } from "app/state/plan.service";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from "rxjs/operators";

@Component({
  selector: "app-opt-group",
  templateUrl: "./opt-group.component.html",
  styleUrls: ["./opt-group.component.css"],
})
export class OptGroupComponent implements OnInit {
  items: PlanItem[] = [];

  grades = [
    { label: "AA", value: 4 },
    { label: "BA", value: 3.5 },
    { label: "BB", value: 3 },
    { label: "CB", value: 2.5 },
    { label: "CC", value: 2 },
    { label: "DC", value: 1.5 },
    { label: "DD", value: 1 },
    { label: "FF", value: 0 },
  ];

  optionsLoading = false;
  selectedCode = "";
  codeInput = new Subject<string>();
  options: string[] = [];

  constructor(
    private planService: PlanService,
    private apiService: ApiService
  ) {
    this.planService.optCourses.subscribe((data) => {
      this.items = data;
    });
  }

  ngOnInit(): void {
    this.codeInput
      .pipe(
        map((term) => {
          return term.toUpperCase().trim();
        })
      )
      .subscribe((term) => {
        if (term.length === 3) {
          this.optionsLoading = true;
          this.apiService
            .getCodes(term)
            .pipe(tap(() => (this.optionsLoading = false)))
            .subscribe((values) => {
              this.options = values;
            });
        } else if (term.length < 3) {
          this.options = [];
        } else {
          this.options = this.options.filter((opt) => {
            return opt.match(new RegExp(term, "gi"));
          });
        }
      });
  }

  setGrade(selectedValue: undefined | { value: Grade }, item: PlanItem) {
    const grade: Grade =
      selectedValue === undefined ? null : selectedValue.value;
    this.planService.setGrade(grade, "Ek Dersler", item.name);
  }

  removeCourse(code: string) {
    this.planService.removeOptCourse(code);
  }

  addNew() {
    console.log(this.selectedCode);
  }
}
