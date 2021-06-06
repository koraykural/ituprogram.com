import { createReducer, on } from '@ngrx/store';
import * as planCoursesActions from './plan-courses.actions';
import { PlanCoursesState } from '../quick-program.state';

export const initialState: Readonly<PlanCoursesState> = {
  courses: [],
  selectedCodes: [],
  hideNotOpened: true,
};
// // TODO: DELETE
// export const initialState: Readonly<PlanCoursesState> = {
//   courses: [],
//   selectedCodes: ['FIZ 101E', 'MAT 103E', 'KIM 101E'],
//   hideNotOpened: true,
// };

export const planCoursesReducer = createReducer(
  initialState,
  on(planCoursesActions.loadCourses, (state, { courses }) => ({
    ...state,
    courses,
    selectedCodes: [],
  })),
  on(planCoursesActions.addCode, (state, { code }) => ({
    ...state,
    courses: state.courses.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        selected: item.code === code ? true : item.selected,
      })),
    })),
    selectedCodes: [...state.selectedCodes, code],
  })),
  on(planCoursesActions.addGroupCodes, (state, { group }) => ({
    ...state,
    courses: state.courses.map((cgroup) => ({
      ...cgroup,
      items: cgroup.items.map((item) => ({
        ...item,
        selected:
          group.items.findIndex((i) => i.code === item.code) >= 0 &&
          item.isOpened
            ? true
            : item.selected,
      })),
    })),
    selectedCodes: [
      ...state.selectedCodes,
      ...group.items
        .filter((i) => i.isOpened && !state.selectedCodes.includes(i.code))
        .map((i) => i.code),
    ],
  })),
  on(planCoursesActions.removeCode, (state, { code }) => ({
    ...state,
    courses: state.courses.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        selected: item.code === code ? false : item.selected,
      })),
    })),
    selectedCodes: state.selectedCodes.filter((c) => c !== code),
  })),
  on(planCoursesActions.removeGroupCodes, (state, { group }) => ({
    ...state,
    courses: state.courses.map((cgroup) => ({
      ...cgroup,
      items: cgroup.items.map((item) => ({
        ...item,
        selected:
          group.items.findIndex((i) => i.code === item.code) >= 0
            ? false
            : item.selected,
      })),
    })),
    selectedCodes: state.selectedCodes.filter(
      (c) => group.items.findIndex((i) => i.code === c) < 0
    ),
  })),
  on(planCoursesActions.toggleHideNotOpened, (state, { hide }) => ({
    ...state,
    hideNotOpened: hide,
  }))
);
