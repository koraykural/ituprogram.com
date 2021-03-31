import { Component, OnInit } from "@angular/core";
import { PlanService } from "app/state/plan.service";
import { Item, Group, Grade, PlanItemMulti, PlanItem } from "app/interfaces";

@Component({
  selector: "app-plan-table",
  templateUrl: "./plan-table.component.html",
  styleUrls: ["./plan-table.component.css"],
})
export class PlanTableComponent implements OnInit {
  constructor(public planService: PlanService) {}

  ngOnInit(): void {}

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

  setGrade(
    selectedValue: undefined | { value: Grade },
    group: Group,
    item: PlanItemMulti | PlanItem
  ) {
    const grade: Grade =
      selectedValue === undefined ? null : selectedValue.value;
    if ("label" in item)
      this.planService.setGrade(grade, group.label, item.label);
    else this.planService.setGrade(grade, group.label, item.name);
  }

  setOptional(groupLabel: string, subgroupLabel: string, itemName: string) {
    this.planService.setOptional(groupLabel, subgroupLabel, itemName);
  }
}
