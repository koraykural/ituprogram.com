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
  filter,
} from 'rxjs/operators';
import { Department, Faculty } from 'src/app/interfaces';
import { ApiService } from '../../services/api.service';
import * as planActions from './plan.actions';
import { AppState } from 'src/app/state/app.state';
import { quickProgramKey } from '../quick-program.state';

@Injectable({
  providedIn: 'any',
})
export class PlanEffects {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private store$: Store<AppState>
  ) {}

  loadDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.selectFaculty),
      withLatestFrom(this.store$),
      map(([action, state]) => state),
      pluck(quickProgramKey, 'plan', 'faculty'),
      filter((faculty): faculty is Faculty => faculty !== null),
      pluck('abbrv'),
      mergeMap((facultyAbbrv) => {
        return this.apiService.getDepartments(facultyAbbrv);
      }),
      catchError(() => EMPTY),
      map((departments) => planActions.departmentsLoaded({ departments }))
    )
  );

  loadTerms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.selectDepartment),
      withLatestFrom(this.store$),
      map(([action, state]) => state),
      pluck(quickProgramKey, 'plan', 'department'),
      filter((department): department is Department => department !== null),
      pluck('abbrv'),
      mergeMap((departmentAbbrv) => {
        return this.apiService.getTerms(departmentAbbrv);
      }),
      catchError(() => EMPTY),
      map((terms) => planActions.termsLoaded({ terms }))
    )
  );
}
