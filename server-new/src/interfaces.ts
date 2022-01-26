export interface CourseBasic {
  code: string;
  name: string;
  description: string;
  credits: number;
  coursePrerequisites: string[];
  gradePrerequisite: string;
}

export interface CourseDetails extends CourseBasic {
  crn: string;
  lecturer: string;
  buildings: string[];
  days: string[];
  hours: string[];
  room: string;
  capacity: number;
  enrolled: number;
  reservation: string;
  majorResctrictions: string[];
}

export type GetDepartmentsResponse = { abbrv: string; name: string }[];

export type GetRegistrationTermsResponse = { name: string; link: string }[];
