import { Component, OnInit } from "@angular/core";
import { InfoService } from "../services/info.service";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.css"],
})
export class CreateComponent implements OnInit {
  constructor(public infoService: InfoService) {}

  ngOnInit(): void {}
}
