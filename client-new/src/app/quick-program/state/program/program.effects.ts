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
  debounceTime,
} from 'rxjs/operators';
import { ApiClass, Department, ProgramClass } from 'src/app/interfaces';
import { ApiService } from '../../services/api.service';
import * as planCoursesActions from '../plan-courses/plan-courses.actions';
import * as programActions from './program.actions';
import { AppState } from 'src/app/state/app.state';
import { quickProgramKey } from '../quick-program.state';
import { FilterService } from '../../services/filter.service';
import { HelperService } from '../../services/helper.service';
import { SortService } from '../../services/sort.service';

@Injectable({
  providedIn: 'any',
})
export class ProgramEffects {
  constructor(
    private helperService: HelperService,
    private filterService: FilterService,
    private sortService: SortService,
    private apiService: ApiService,
    private actions$: Actions,
    private store$: Store<AppState>
  ) {}

  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planCoursesActions.addCode, planCoursesActions.addGroupCodes),
      debounceTime(1000),
      withLatestFrom(this.store$),
      map(([action, state]) => state),
      pluck(quickProgramKey, 'planCourses'),
      mergeMap(({ selectedCodes }) => {
        return this.apiService.getClasses(selectedCodes);
      }),
      catchError(() => EMPTY),
      map<ApiClass[], ProgramClass[]>((courses) =>
        courses.map((course) => ({
          ...course,
          canBeSelected: true,
          selected: false,
        }))
      ),
      map((courses) => programActions.loadCourses({ courses }))
    )
  );

  removeCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        planCoursesActions.removeCode,
        planCoursesActions.removeGroupCodes
      ),
      debounceTime(1000),
      withLatestFrom(this.store$),
      map(([action, state]) => state),
      pluck(quickProgramKey),
      map(({ planCourses, program }) => {
        const selectedCodes = planCourses.selectedCodes;
        const courses = program.courses;
        return courses.filter((course) => selectedCodes.includes(course.code));
      }),
      map((courses) => programActions.loadCourses({ courses }))
    )
  );

  coursesChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        programActions.loadCourses,
        programActions.selectCourse,
        programActions.deselectCourse,
        programActions.updateFilter
      ),
      withLatestFrom(this.store$),
      map(([action, state]) => state),
      pluck(quickProgramKey),
      map(({ plan, program }) => ({
        userDepartment: plan.department as Department,
        courses: program.courses,
        selectedCourses: program.selectedCourses,
        filter: program.filter,
        sort: program.sort,
      })),
      map((obj) => ({
        ...obj,
        courses: this.helperService.setCanBeSelectedProperty(
          obj.courses,
          obj.selectedCourses
        ),
      })),
      map((obj) => ({
        sort: obj.sort,
        courses: this.filterService.filterData(obj),
      })),
      map(({ sort, courses }) => this.sortService.sortData(courses, sort)),
      map((courses) => programActions.setFilteredCourses({ courses }))
    )
  );

  sortChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(programActions.updateSort),
      withLatestFrom(this.store$),
      map(([action, state]) => state),
      pluck(quickProgramKey, 'program'),
      map(({ filteredCourses, sort }) => ({
        courses: filteredCourses,
        sort,
      })),
      map(({ sort, courses }) => this.sortService.sortData(courses, sort)),
      map((courses) => programActions.setFilteredCourses({ courses }))
    )
  );
}
