import { createAction, props } from '@ngrx/store';
import { Department, Faculty, Term } from 'src/app/interfaces';

export const selectFaculty = createAction(
  '[Plan] Select Faculty',
  props<{ faculty: Faculty }>()
);

export const departmentsLoaded = createAction(
  '[Plan] Departments Loaded',
  props<{ departments: Department[] }>()
);

export const selectDepartment = createAction(
  '[Plan] Select Department',
  props<{ department: Department }>()
);

export const termsLoaded = createAction(
  '[Plan] Terms Loaded',
  props<{ terms: Term[] }>()
);

export const selectTerm = createAction(
  '[Plan] Select Term',
  props<{ term: Term }>()
);
