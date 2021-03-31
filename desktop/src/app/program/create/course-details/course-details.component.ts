import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ElementRef,
} from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";
import { Class } from "app/interfaces";

@Component({
  selector: "app-course-details",
  templateUrl: "./course-details.component.html",
  styleUrls: ["./course-details.component.css"],
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
      }
    `,
  ],
  animations: [
    trigger("grow", [
      transition("void <=> *", []),
      transition(
        "* <=> *",
        [style({ height: "{{startHeight}}px" }), animate(".2s ease-in-out")],
        { params: { startHeight: 0 } }
      ),
    ]),
  ],
})
export class CourseDetailsComponent implements OnInit {
  @Input() course: Class;

  startHeight: number = 224;

  @HostBinding("@grow") get grow() {
    return {
      value: this.course,
      params: { startHeight: this.startHeight },
    };
  }

  constructor(private element: ElementRef) {}

  setStartHeight() {
    this.startHeight = this.element.nativeElement.clientHeight;
  }

  ngOnChanges() {
    this.setStartHeight();
  }

  ngOnInit(): void {}
}
