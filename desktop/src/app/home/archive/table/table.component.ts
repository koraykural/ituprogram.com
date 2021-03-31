import { Component, OnInit } from "@angular/core";
import { ArchiveService } from "../archive.service";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class TableComponent implements OnInit {
  shortCells = ["enrolled", "capacity", "crn"];
  constructor(public archiveService: ArchiveService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.archiveService.reset();
  }
}
