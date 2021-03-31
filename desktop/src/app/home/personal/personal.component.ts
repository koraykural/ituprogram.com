import { Component, OnInit } from "@angular/core";
import { PlanService } from "app/state/plan.service";

@Component({
  selector: "app-personal",
  templateUrl: "./personal.component.html",
  styleUrls: ["./personal.component.css"],
})
export class PersonalComponent implements OnInit {
  constructor(public planService: PlanService) {}

  ngOnInit(): void {}
}
