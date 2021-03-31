import { Component, OnInit } from "@angular/core";
import { ProgramService } from "../services/program.service";
import { PlanService } from "app/state/plan.service";

@Component({
  selector: "app-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.css"],
})
export class PlanComponent implements OnInit {
  constructor(
    private programService: ProgramService,
    private planService: PlanService
  ) {}

  ngOnInit(): void {
    if (this.programService.planData.value.length === 0) {
      // this.programService.setPlanData(this.planService.planData.value);
      this.programService.id = this.generateId();
    }
  }

  generateId() {
    let digits = "0123456789";
    let id = "";

    for (let i = 0; i < 6; i++) {
      id += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return id;
  }
}
