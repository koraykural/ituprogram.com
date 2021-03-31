import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Grade, Item, PlanItemMulti } from "app/interfaces";

@Component({
  selector: "tr[app-optional]",
  templateUrl: "./optional.component.html",
  styleUrls: ["./optional.component.css"],
})
export class OptionalComponent implements OnInit {
  @Input() data: PlanItemMulti;
  @Input() grades: { labe: string; value: number }[];
  @Output() grade = new EventEmitter<undefined | { value: Grade }>();
  @Output() select = new EventEmitter<string>();

  selectedCourse: string;

  constructor() {}

  ngOnInit(): void {
    this.data.items.forEach((item) => {
      if (item.selected) {
        this.selectedCourse = item.name;
      }
    });
  }

  setGrade(selectedValue: undefined | { value: Grade }) {
    this.grade.emit(selectedValue);
  }

  setOptional(selectedValue: any) {
    this.select.emit(selectedValue.name);
  }

  itemSearchFn(term: string, item: Item) {
    term = term.toLocaleLowerCase("tr");
    return (
      item.name.toLocaleLowerCase("tr").match(new RegExp(term, "g")) ||
      item.code.toLocaleLowerCase("tr").match(new RegExp(term, "g"))
    );
  }
}
