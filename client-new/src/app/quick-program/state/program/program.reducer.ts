import { createReducer, on } from '@ngrx/store';
import * as programActions from './program.actions';
import { ProgramState } from '../quick-program.state';

export const initialState: Readonly<ProgramState> = {
  courses: [],
  selectedCourses: [],
  filteredCourses: [],
  filter: {
    codes: [],
    days: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
    hideAlternatives: true,
    hideConflicts: true,
    hideMajorRestricted: true,
  },
  sort: {
    by: 'alternative-count',
    order: 'asc',
  },
};

export const programReducer = createReducer(
  initialState,
  on(programActions.loadCourses, (state, { courses }) => {
    const selectedCourses = state.selectedCourses.filter(
      (course) => courses.findIndex((c) => c.code === course.code) >= 0
    );
    return {
      ...state,
      courses: courses.map((course) => ({
        ...course,
        selected: selectedCourses.findIndex((c) => c.crn === course.crn) >= 0,
      })),
      selectedCourses,
      filter: {
        ...state.filter,
        codes: [...new Set(courses.map((c) => c.code))],
      },
    };
  }),
  on(programActions.setFilteredCourses, (state, { courses }) => ({
    ...state,
    filteredCourses: courses,
  })),
  on(programActions.selectCourse, (state, { course }) => ({
    ...state,
    courses: state.courses.map((c) => ({
      ...c,
      selected: c.crn === course.crn || c.selected,
    })),
    selectedCourses: [...state.selectedCourses, course],
  })),
  on(programActions.deselectCourse, (state, { course }) => ({
    ...state,
    courses: state.courses.map((c) => ({
      ...c,
      selected: c.crn !== course.crn && c.selected,
    })),
    selectedCourses: state.selectedCourses.filter((c) => c.crn !== course.crn),
  })),
  on(programActions.updateFilter, (state, { filter }) => ({
    ...state,
    filter: {
      ...state.filter,
      ...filter,
    },
  })),
  on(programActions.updateSort, (state, { sort }) => ({
    ...state,
    sort: {
      ...state.sort,
      ...sort,
    },
  }))
);
