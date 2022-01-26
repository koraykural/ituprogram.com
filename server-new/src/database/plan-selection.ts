import { FacultySchema } from '../config/mongo';
import { GetDepartmentsResponse, GetRegistrationTermsResponse } from '../interfaces';

export const getDepartments = async (facultyAbbrv: string): Promise<GetDepartmentsResponse> => {
  const doc = await FacultySchema.findOne({ abbrv: facultyAbbrv })
    .lean()
    .select({ 'departments.abbrv': 1, 'departments.name': 1 })
    .exec();
  if (!doc) {
    return [];
  }
  return doc.departments;
};

export const getRegistrationTerms = async (
  departmentAbbrv: string,
): Promise<GetRegistrationTermsResponse> => {
  const doc = await FacultySchema.findOne(
    { 'departments.abbrv': departmentAbbrv },
    { 'departments.$': 1 },
  ).exec();
  return doc?.departments[0].terms || [];
};
