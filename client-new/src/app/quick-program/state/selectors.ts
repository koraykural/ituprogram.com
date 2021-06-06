import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { quickProgramKey, QuickProgramState } from './quick-program.state';

export const selectQuickProgram =
  createFeatureSelector<AppState, QuickProgramState>(quickProgramKey);

export const selectPlan = createSelector(
  selectQuickProgram,
  (state) => state.plan
);

export const selectPlanCourses = createSelector(
  selectQuickProgram,
  (state) => state.planCourses
);

export const selectProgram = createSelector(
  selectQuickProgram,
  (state) => state.program
);
