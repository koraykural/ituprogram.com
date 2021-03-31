import { Component, OnInit } from "@angular/core";
import { ProgramService } from "app/program/services/program.service";
import { ItemProgram } from "app/interfaces";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class TableComponent implements OnInit {
  showData = false;

  constructor(public programService: ProgramService) {}

  ngOnInit(): void {
    // setTimeout(() => {
    // }, 400);
    this.showData = true;
  }

  letterGrade(g: number) {
    switch (g) {
      case 4:
        return "AA";
      case 3.5:
        return "BA";
      case 3:
        return "BB";
      case 2.5:
        return "CB";
      case 2:
        return "CC";
      case 1.5:
        return "DC";
      case 1:
        return "DD";
      case 0:
        return "FF - VF";
      default:
        return "";
    }
  }

  isItemVisible(item: ItemProgram) {
    return item.grade < this.programService.maxGrade &&
      this.programService.isNotOpenedHidden
      ? item.isOpened
      : true;
  }

  itemSearchFn(term: string, item: ItemProgram) {
    term = term.toLocaleLowerCase("tr");
    return (
      item.name.toLocaleLowerCase("tr").match(new RegExp(term, "g")) ||
      item.code.toLocaleLowerCase("tr").match(new RegExp(term, "g"))
    );
  }

  rowClick(item: ItemProgram) {
    if (!item.isOpened) return;
    item.selected = !item.selected;
    if (item.selected) {
      this.programService.addCode(item.code);
    } else {
      this.programService.removeCode(item.code);
    }
  }
}
