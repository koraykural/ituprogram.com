import { Component, OnInit } from "@angular/core";
import { ProgramService } from "app/program/services/program.service";
import { Class } from "app/interfaces";
import { InfoService } from "app/program/services/info.service";
import { PoolService } from "app/program/services/pool.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-pool",
  templateUrl: "./pool.component.html",
  styleUrls: ["./pool.component.css"],
})
export class PoolComponent implements OnInit {
  dataSource: Observable<Class[]>;

  displayedColumns: string[] = [
    "selected",
    "code",
    "name",
    "days",
    "hours",
    "buildings",
    "crn",
  ];

  constructor(
    public programService: ProgramService,
    public infoService: InfoService,
    public poolService: PoolService
  ) {}

  ngOnInit(): void {
    /* TODO: Resets selected courses */
    // setTimeout(() => {
    // }, 500);
    this.dataSource = this.poolService.getData();
  }

  ngOnDestroy(): void {
    this.dataSource = null;
  }

  rowClick(course: Class) {
    if (course.selected) {
      this.poolService.removeFromSelection(course);
    } else if (course.canBeSelected) {
      this.poolService.addToSelection(course);
    }
  }
}
