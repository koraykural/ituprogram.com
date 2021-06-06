import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { pluck, tap } from 'rxjs/operators';
import { ProgramClass } from 'src/app/interfaces';
import { AppState } from 'src/app/state/app.state';
import { InfoService } from '../../services/info.service';
import { selectProgram } from '../../state/selectors';
import * as planCoursesActions from '../../state/plan-courses/plan-courses.actions';
import * as programActions from '../../state/program/program.actions';

@Component({
  selector: 'app-class-pool',
  templateUrl: './class-pool.component.html',
  styleUrls: ['./class-pool.component.scss'],
})
export class ClassPoolComponent implements OnInit {
  courses$ = this.store.pipe(select(selectProgram), pluck('filteredCourses'));

  constructor(
    private store: Store<AppState>,
    public infoService: InfoService
  ) {}

  ngOnInit(): void {
    // // TODO: DELETE
    // this.store.dispatch(planCoursesActions.addCode({ code: 'ING 201' }));
  }

  rowClick(course: ProgramClass) {
    if (course.selected) {
      this.store.dispatch(programActions.deselectCourse({ course }));
    } else if (course.canBeSelected) {
      this.store.dispatch(programActions.selectCourse({ course }));
    } else {
      throw new Error('Non selectable row is selected');
    }
  }

  identifier(index: number, value: ProgramClass) {
    return value.selected;
  }
}
