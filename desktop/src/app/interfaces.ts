export interface Class {
  code: string;
  name: string;
  days: Array<string>;
  hours: Array<string>;
  lecturer: string;
  buildings: Array<string>;
  crn: number;
  enrolled: number;
  capacity: number;
  credits: number;
  restricts: Array<string>;
  preReqs: string[];
  isOpened: boolean;
  selected: boolean;
  hidden?: boolean;
  canBeSelected: boolean;
  visible?: boolean;
}

export interface Archive {
  _id: string;
  term: string;
  codeLetter: string;
  classes: Class[];
}

export interface Faculty {
  name: string;
  abrv: string;
}

export interface Subject {
  name: string;
  abrv: string;
}

export interface Term {
  name: string;
  link: string;
}

export interface SelectedPlan {
  faculty: Faculty;
  subject: Subject;
  term: Term;
}

interface ItemBase {
  code: string;
  name: string;
  credits: number;
  isSubGroup: boolean;
  subItems?: {
    code: string;
    name: string;
    selected: boolean;
  }[];
  grade?: number;
}
export interface ItemPlan extends ItemBase {}
export interface ItemProgram extends ItemBase {
  isOpened?: boolean;
  selected?: boolean;
  subItems?: {
    code: string;
    name: string;
    selected: boolean;
    isOpened: boolean;
    disabled: boolean;
  }[];
}

interface GroupBase {
  label: string;
}
export interface GroupPlan extends GroupBase {
  items: ItemPlan[];
}
export interface GroupProgram extends GroupBase {
  items: ItemProgram[];
}
export interface GroupApi extends GroupBase {
  items: {
    code: string;
    name: string;
    credits: number;
    isOpened: boolean;
  }[];
}

export enum Days {
  "Pazartesi" = 0,
  "Salı" = 1,
  "Çarşamba" = 2,
  "Perşembe" = 3,
  "Cuma" = 4,
}
export interface CellData {
  state: "ok" | "warning" | "error" | "empty";
  course: Class;
  day: Days;
  hour: number;
}

export interface TimeSlot {
  day: number;
  hour: number;
}

// TODO: Temporary
export interface Group {
  label: string;
  grade?: number;
  items: ItemBase[];
  subGroups: Group[];
}
export interface Item {
  code: string;
  name: string;
  credits: number;
  grade?: number;
}

export type Grade = null | 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4;

export interface PlanItem {
  code: string;
  name: string;
  credits: number;
  grade: Grade;
}

export interface PlanItemMulti {
  label: string;
  credits: number;
  items: {
    code: string;
    name: string;
    selected: boolean;
  }[];
  grade: Grade;
}

export interface PlanGroup {
  label: string;
  items: (PlanItem | PlanItemMulti)[];
}

export type PlanData = PlanGroup[];
