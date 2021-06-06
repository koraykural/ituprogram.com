import { createAction, props } from '@ngrx/store';
import { Filter, ProgramClass, Sort } from 'src/app/interfaces';

export const loadCourses = createAction(
  '[Program] Load Courses',
  props<{ courses: ProgramClass[] }>()
);

export const setFilteredCourses = createAction(
  '[Program] Set Filtered Courses',
  props<{ courses: ProgramClass[] }>()
);

export const selectCourse = createAction(
  '[Program] Select Course',
  props<{ course: ProgramClass }>()
);

export const deselectCourse = createAction(
  '[Program] Deselect Course',
  props<{ course: ProgramClass }>()
);

export const updateFilter = createAction(
  '[Program] Update Filter',
  props<{ filter: Partial<Filter> }>()
);

export const updateSort = createAction(
  '[Program] Update Sort',
  props<{ sort: Partial<Sort> }>()
);
