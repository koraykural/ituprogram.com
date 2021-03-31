import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  @Input() icon: string;
  @Input() text: string;
  @Input() theme: string;
  @Input() link: string;
  @Input() inappLink: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
