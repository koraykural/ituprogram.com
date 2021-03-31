import { Component, OnInit } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { ProgramService } from "app/program/services/program.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent implements OnInit {
  maxGrade = this.programService.maxGrade - 0.1;

  constructor(public programService: ProgramService) {}

  ngOnInit(): void {}

  isOpenedFilterChange(value: boolean) {
    this.programService.isNotOpenedHidden = value;
  }

  maxGradeFilterChange(value: undefined | { value: number }) {
    this.programService.maxGrade = value ? value.value + 0.1 : 4.1;
  }

  grades = [
    { label: "BA", value: 3.5 },
    { label: "BB", value: 3 },
    { label: "CB", value: 2.5 },
    { label: "CC", value: 2 },
    { label: "DC", value: 1.5 },
    { label: "DD", value: 1 },
    { label: "FF - VF", value: 0 },
  ];
}
