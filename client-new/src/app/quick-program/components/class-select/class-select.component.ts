import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, pluck, tap } from 'rxjs/operators';
import { AppState } from 'src/app/state/app.state';
import { selectPlanCourses } from '../../state/selectors';
import * as planCoursesActions from '../../state/plan-courses/plan-courses.actions';
import * as planActions from '../../state/plan/plan.actions';
import { PlanClassGroup } from 'src/app/interfaces';

@Component({
  selector: 'app-class-select',
  templateUrl: './class-select.component.html',
  styleUrls: ['./class-select.component.scss'],
})
export class ClassSelectComponent implements OnInit {
  groupLabels$ = this.store.pipe(
    select(selectPlanCourses),
    pluck('courses'),
    map((value) => value.map((group) => group.label))
  );
  hideNotOpened = true;
  hideNotOpened$ = this.store.pipe(
    select(selectPlanCourses),
    pluck('hideNotOpened'),
    tap((val) => {
      this.hideNotOpened = val;
    })
  );
  disableContinue$ = this.store.pipe(
    select(selectPlanCourses),
    pluck('selectedCodes'),
    map((codes) => codes.length < 1)
  );

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // // TODO: DELETE
    // this.store.dispatch(
    //   planActions.selectTerm({
    //     term: {
    //       link: '201810.html',
    //       name: '2017-2018 Sonrası',
    //     },
    //   })
    // );
  }

  toggleHideNotOpened(hide: boolean): void {
    this.store.dispatch(planCoursesActions.toggleHideNotOpened({ hide }));
  }

  trackByFn(index: number, item: PlanClassGroup) {
    return item.items.map((item) => item.selected).join();
  }
}
