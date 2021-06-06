import { createReducer, on } from '@ngrx/store';
import { PlanState } from '../quick-program.state';
import { faculties } from './faculties';
import * as planActions from './plan.actions';

// // TODO: DELETE
// export const initialState: Readonly<PlanState> = {
//   faculties: faculties,
//   faculty: {
//     abbrv: 'BB',
//     name: 'Bilgisayar ve Bilişim Fakültesi',
//   },
//   departments: [
//     { abbrv: 'BLG', name: 'Bilgisayar Mühendisliği (% 30 İngilizce)' },
//     { abbrv: 'BLGE', name: 'Bilgisayar Mühendisliği (% 100 İngilizce)' },
//     {
//       abbrv: 'YZVE',
//       name: 'Yapay Zeka ve Veri Mühendisliği (% 100 İngilizce)',
//     },
//   ],
//   departmentsLoading: false,
//   department: {
//     abbrv: 'BLGE',
//     name: 'Bilgisayar Mühendisliği (% 100 İngilizce)',
//   },
//   terms: [
//     {
//       name: '2010-2011/Güz Dönemi ile 2011-2012 Güz Dönemi Arası',
//       link: '201110.html',
//     },
//     {
//       name: '2011-2012/ Güz ile 2017-2018 / Güz Dönemleri Arası',
//       link: '201210.html',
//     },
//     { name: '2017-2018 / Güz Dönemi Sonrası', link: '201810.html' },
//   ],
//   termsLoading: false,
//   term: {
//     link: '201810.html',
//     name: '2017-2018 Sonrası',
//   },
// };

export const initialState: Readonly<PlanState> = {
  faculties: faculties,
  faculty: null,
  departments: [],
  departmentsLoading: false,
  department: null,
  terms: [],
  termsLoading: false,
  term: null,
};

export const planReducer = createReducer(
  initialState,
  on(planActions.selectFaculty, (state, { faculty }) => ({
    ...initialState,
    faculty: faculty,
    departmentsLoading: true,
  })),
  on(planActions.departmentsLoaded, (state, { departments }) => ({
    ...state,
    departmentsLoading: false,
    departments: departments,
  })),
  on(planActions.selectDepartment, (state, { department }) => ({
    ...state,
    department: department,
    terms: [],
    termsLoading: true,
    term: null,
  })),
  on(planActions.termsLoaded, (state, { terms }) => ({
    ...state,
    termsLoading: false,
    terms: terms,
  })),
  on(planActions.selectTerm, (state, { term }) => ({
    ...state,
    term: term,
  }))
);
