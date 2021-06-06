export interface Faculty {
  name: string;
  abbrv: string;
}

export interface Department {
  name: string;
  abbrv: string;
}

export interface Term {
  name: string;
  link: string;
}

export interface Plan {
  faculty: Faculty | null;
  department: Department | null;
  term: Term | null;
}

export interface PlanClassItem {
  code: string;
  name: string;
  credits: number;
  selected: boolean;
  isOpened: boolean;
}

export interface PlanClassGroup {
  label: string;
  items: PlanClassItem[];
  isCollapsed: boolean;
}

export interface ClassRepresentation {
  code: string;
  name: string;
  lecturer: string;
  days: string;
  hours: string;
  buildings: string;
  enrolled: number;
  capacity: number;
  preReqs: string;
  restricts: string;
  crn: number;
}

export interface ApiClass {
  code: string;
  name: string;
  days: Day[];
  hours: string[];
  lecturer: string;
  buildings: string[];
  preReqs: string[];
  crn: number;
  enrolled: number;
  capacity: number;
  restricts: string[];
}

export interface ProgramClass extends ApiClass {
  selected: boolean;
  canBeSelected: boolean;
}

export interface Program {
  id: string;
  faculty: string;
  subject: string;
  term: string;
  classes: string[]; // code
  selectedClasses: string[]; // crn
}

export interface Filter {
  codes: string[];
  days: Day[];
  hideConflicts: boolean;
  hideAlternatives: boolean;
  hideMajorRestricted: boolean;
}

export interface Sort {
  by: 'code' | 'crn' | 'name' | 'days' | 'hours' | 'alternative-count';
  order: 'asc' | 'desc';
}

export enum DaysEnum {
  'Pazartesi' = 0,
  'Salı' = 1,
  'Çarşamba' = 2,
  'Perşembe' = 3,
  'Cuma' = 4,
}

export type Day = 'Pazartesi' | 'Salı' | 'Çarşamba' | 'Perşembe' | 'Cuma';

export interface CellData {
  state: 'ok' | 'warning' | 'error' | 'empty';
  course: ProgramClass | null;
  day: DaysEnum;
  hour: number;
}

export interface TimeSlot {
  day: number;
  hour: number;
}
