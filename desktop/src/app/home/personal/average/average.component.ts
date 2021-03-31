import { Component, OnInit } from "@angular/core";
import { PlanService } from "app/state/plan.service";

@Component({
  selector: "app-average",
  templateUrl: "./average.component.html",
  styleUrls: ["./average.component.css"],
})
export class AverageComponent implements OnInit {
  constructor(public planService: PlanService) {}

  ngOnInit(): void {}
}
