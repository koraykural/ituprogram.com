import { fetchDersPlani, fetchDersPlanlari1, fetchDersPlanlari2 } from './fetches';
import {
  parseDepartments,
  parseFaculties,
  parsePlanGroups,
  parseRegistrationTerms,
} from './html-parsers';

export const scrapeFaculties = async (): Promise<{ name: string; abbrv: string }[]> => {
  const html = await fetchDersPlanlari1('IS');
  const faculties = parseFaculties(html);
  return faculties;
};

export const scrapeDepartments = async (
  facultyAbbrv: string,
): Promise<{ name: string; abbrv: string }[]> => {
  const html = await fetchDersPlanlari1(facultyAbbrv);
  const departments = parseDepartments(html);
  return departments;
};

export const scrapeRegistrationTerms = async (
  departmentAbbrv: string,
): Promise<{ name: string; link: string }[]> => {
  const html = await fetchDersPlanlari2(departmentAbbrv);
  const registrationTerms = parseRegistrationTerms(html);
  return registrationTerms;
};

export const scrapePlan = async (
  departmentAbbrv: string,
  registrationTermLink: string,
): Promise<{ name: string; courses: string[] }[]> => {
  const html = await fetchDersPlani(departmentAbbrv, registrationTermLink);
  const mainGroups = parsePlanGroups(html);
  const groups: { name: string; courses: string[] }[] = [];
  for (const mainGroup of mainGroups) {
    groups.push({
      name: mainGroup.name,
      courses: mainGroup.courseCodes,
    });
    for (const subGroup of mainGroup.subGroups) {
      const html = await fetchDersPlani(departmentAbbrv, subGroup.url);
      const subGroupData = parsePlanGroups(html)[0];
      groups.push({
        name: subGroup.name,
        courses: subGroupData.courseCodes,
      });
    }
  }
  return groups;
};
