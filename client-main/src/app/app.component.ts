import { Component, Output, EventEmitter } from '@angular/core';
import { Class, Group } from './interfaces';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Output() planData = new EventEmitter();
  planLink: string;
  plan: Array<Group>;
  classes: any;
  title: "İTÜ Program"

  constructor() {}

  ngOnInit() {}
}
