import { createAction, props } from '@ngrx/store';
import { PlanClassGroup } from 'src/app/interfaces';

export const loadCourses = createAction(
  '[Plan Courses] Select Plan',
  props<{ courses: PlanClassGroup[] }>()
);

export const addCode = createAction(
  '[Plan Courses] Add Code',
  props<{ code: string }>()
);

export const removeCode = createAction(
  '[Plan Courses] Remove Code',
  props<{ code: string }>()
);

export const addGroupCodes = createAction(
  '[Plan Courses] Add Group Codes',
  props<{ group: PlanClassGroup }>()
);

export const removeGroupCodes = createAction(
  '[Plan Courses] Remove Group Codes',
  props<{ group: PlanClassGroup }>()
);

export const toggleHideNotOpened = createAction(
  '[Plan Courses] Toggle Hide Not Opened',
  props<{ hide: boolean }>()
);
