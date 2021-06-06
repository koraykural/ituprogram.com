import {
  Department,
  Faculty,
  Filter,
  PlanClassGroup,
  ProgramClass,
  Sort,
  Term,
} from 'src/app/interfaces';

export interface PlanState {
  faculties: Faculty[];
  faculty: Faculty | null;
  departments: Department[];
  departmentsLoading: boolean;
  department: Department | null;
  terms: Term[];
  termsLoading: boolean;
  term: Term | null;
}

export interface PlanCoursesState {
  courses: PlanClassGroup[];
  selectedCodes: string[];
  hideNotOpened: boolean;
}

export interface ProgramState {
  courses: ProgramClass[];
  selectedCourses: ProgramClass[];
  filteredCourses: ProgramClass[];
  filter: Filter;
  sort: Sort;
}

export interface QuickProgramState {
  plan: Readonly<PlanState>;
  planCourses: Readonly<PlanCoursesState>;
  program: Readonly<ProgramState>;
}

export const quickProgramKey = 'quick-program';
