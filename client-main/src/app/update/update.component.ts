import { Component, OnInit } from "@angular/core";
import { UpdateStatus } from "../interfaces";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-update",
  templateUrl: "./update.component.html",
  styleUrls: ["./update.component.css"],
})
export class UpdateComponent implements OnInit {
  update: UpdateStatus;
  err = false;
  now = new Date(Date.now());

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getUpdateStatus().subscribe(
      (val) => {
        this.update = val;
        this.err = false;
      },
      (err) => {
        this.err = true;
      }
    );
  }
}
