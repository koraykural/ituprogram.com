import { Component, OnInit } from "@angular/core";
import { TableService } from "app/program/services/table.service";
import { CellData } from "app/interfaces";
import { InfoService } from "app/program/services/info.service";

@Component({
  selector: "app-weekly-table",
  templateUrl: "./weekly-table.component.html",
  styleUrls: ["./weekly-table.component.css"],
})
export class WeeklyTableComponent implements OnInit {
  data: CellData[][] = [];
  constructor(
    private tableService: TableService,
    public infoService: InfoService
  ) {}

  ngOnInit(): void {
    this.data = this.tableService.tableData;
    this.tableService.tableChanged.subscribe((x) => {
      this.data = this.tableService.tableData;
    });
  }

  dayLabels = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  hourLabels = [
    "08.30",
    "09.30",
    "10.30",
    "11.30",
    "12.30",
    "13.30",
    "14.30",
    "15.30",
    "16.30",
  ];

  cellDisplay(d: CellData) {
    if (d.course) {
      return d.course.code;
    } else {
      return "";
    }
  }

  mouseEnterCell(cell: CellData) {
    if (cell.course) {
      this.infoService.mouseEntered(cell.course);
    }
  }

  mouseLeftCell() {
    this.infoService.clearHovered();
  }
}
