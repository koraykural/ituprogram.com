import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ElementRef,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProgramClass } from 'src/app/interfaces';
import { InfoService } from 'src/app/quick-program/services/info.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
      }
    `,
  ],
  animations: [
    trigger('grow', [
      transition('void <=> *', []),
      transition(
        '* <=> *',
        [style({ height: '{{startHeight}}px' }), animate('.2s ease-in-out')],
        { params: { startHeight: 0 } }
      ),
    ]),
  ],
})
export class CourseDetailsComponent implements OnInit {
  private course = this.infoService.hoveredCourse;
  course$ = this.course.asObservable();

  startHeight: number = 224;

  @HostBinding('@grow') get grow() {
    return {
      value: this.course.value,
      params: { startHeight: this.startHeight },
    };
  }

  constructor(private infoService: InfoService, private element: ElementRef) {}

  setStartHeight() {
    this.startHeight = this.element.nativeElement.clientHeight;
  }

  ngOnChanges() {
    this.setStartHeight();
  }

  ngOnInit(): void {}
}
