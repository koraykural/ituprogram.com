export interface Class {
  code: string;
  name: string;
  teachingMethod: string;
  days: Array<string>;
  hours: Array<string>;
  lecturer: string;
  buildings: Array<string>;
  selected: boolean;
  crn: number;
  enrolled: number;
  capacity: number;
  restricts: Array<string>;
  isOpened: boolean;
  credits: number;
}

export interface Program {
  id: string;
  faculty: string;
  subject: string;
  term: string;
  classes: Array<string>; // code
  selectedClasses: Array<string>; // crn
}

export interface Filter {
  code: Array<{ id: string; amount: number; checked: boolean }>;
  days: Array<{ id: string; checked: boolean }>;
  buildings: Array<{ id: string; checked: boolean }>;
  major: boolean;
}

export interface Item {
  code: string;
  name: string;
  credits: number;
  selected: boolean;
  isOpened: boolean;
}
export interface Group {
  label: string;
  items: Array<Item>;
  allSelected: boolean;
  isCollapsed: boolean;
}
export interface Groups extends Array<Group> {}

export interface Faculty {
  name: string;
  abrv: string;
}
export interface Faculties extends Array<Faculty> {}

export interface Subject {
  name: string;
  abrv: string;
}
export interface Subjects extends Array<Subject> {}

export interface Term {
  name: string;
  link: string;
}
export interface Terms extends Array<Term> {}

export interface UpdateStatus {
  classes: {
    code: string;
    situation: string;
    last_update: Date;
  }[];
  plans: {
    situation: string;
    last_update: Date;
  };
  opened_classes: {
    situation: string;
    last_update: Date;
  };
}
