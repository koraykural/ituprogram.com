export interface Class {
  code: string;
  name: string;
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