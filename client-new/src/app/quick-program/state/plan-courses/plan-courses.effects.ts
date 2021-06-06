import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  withLatestFrom,
  pluck,
} from 'rxjs/operators';
import { Department, Term } from 'src/app/interfaces';
import { ApiService } from '../../services/api.service';
import * as planActions from '../plan/plan.actions';
import * as planCoursesActions from './plan-courses.actions';
import { AppState } from 'src/app/state/app.state';
import { quickProgramKey } from '../quick-program.state';

@Injectable({
  providedIn: 'any',
})
export class PlanCoursesEffects {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private store$: Store<AppState>
  ) {}

  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.selectTerm),
      withLatestFrom(this.store$),
      map(([action, state]) => state),
      pluck(quickProgramKey, 'plan'),
      mergeMap(({ department, term }) => {
        return this.apiService.getPlanData(
          department as Department,
          term as Term
        );
      }),
      catchError(() => EMPTY),
      map((courses) =>
        planCoursesActions.loadCourses({
          courses: courses.map((group) => ({
            ...group,
            allSelected: false,
            isCollapsed: true,
            items: group.items.map((item) => ({
              ...item,
              selected: false,
            })),
          })),
        })
      )
    )
  );
}
