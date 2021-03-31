import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @Input() nextLink: string;
  @Input() nextText: string;
  @Input() nextTheme: "danger";
  @Input() nextDescription: string;
  @Input() nextNoIcon: boolean;
  @Input() backLink: string;
  @Input() backText: string;
  @Input() backTheme: "danger";
  @Input() backDescription: string;
  @Input() backNoIcon: boolean;

  constructor() {}

  ngOnInit(): void {}
}
