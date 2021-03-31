import { Component, OnInit } from "@angular/core";
import { FilterService } from "app/program/services/filter.service";
import { ProgramService } from "app/program/services/program.service";
import { SortService } from "app/program/services/sort.service";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"],
})
export class FiltersComponent implements OnInit {
  constructor(
    public filterService: FilterService,
    public programService: ProgramService,
    public sortService: SortService
  ) {}

  ngOnInit(): void {}
}
