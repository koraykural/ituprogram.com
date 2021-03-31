import { Component, OnInit } from "@angular/core";
import { ProgramService } from "app/program/services/program.service";
import { TableService } from "app/program/services/table.service";
import { PoolService } from "app/program/services/pool.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(
    private programService: ProgramService,
    private tableService: TableService,
    private poolService: PoolService
  ) {}

  ngOnInit(): void {
    this.programService.reset();
    this.tableService.clearTable();
    this.poolService.clear();
  }
}
