/* -------------------------------------------------------------------------- */
/*                                Express Zone                                */
/* -------------------------------------------------------------------------- */
import express from 'express';
import { PORT } from './config/env';
import { mainRouter } from './routes';
import { errorMiddleware } from './middlewares';

const app = express();
app.use(express.json());
app.use(mainRouter);
app.use(errorMiddleware());
// app.listen(PORT, () => {
//   // eslint-disable-next-line no-console
//   console.info(`Server is started on port ${PORT}`);
// });

/* -------------------------------------------------------------------------- */
/*                                Testing Zone                                */
/*                    TODO: Always remove before production                   */
/* -------------------------------------------------------------------------- */
import fs from 'fs';
import { scrapeCourseData, scrapeOpenCourses } from './scrapers/courses';
import { courseCodes, importantCourseCodes } from './data';
import {
  scrapeDepartments,
  scrapeFaculties,
  scrapePlan,
  scrapeRegistrationTerms,
} from './scrapers/plans';
import { IFaculty } from './models/faculty.model';
import { FacultySchema } from './config/mongo';

const _scrapeAllCourses = async () => {
  const res = await scrapeOpenCourses(courseCodes);
  fs.writeFileSync('open-courses.json', JSON.stringify(res));
};

const _scrapeImportantCourses = async () => {
  const res = await scrapeOpenCourses(importantCourseCodes);
  fs.writeFileSync('open-courses-important.json', JSON.stringify(res));
};

const _getFaculties = async () => {
  const res = await scrapeFaculties();
  // eslint-disable-next-line no-console
  console.info(`SCRAPED ${res.length} FACULTIES`);
  return res;
};

const _getDepartments = async () => {
  const faculties = await _getFaculties();
  const allDepartments: {
    faculty: { name: string; abbrv: string };
    departments: { name: string; abbrv: string }[];
  }[] = [];
  for (const faculty of faculties) {
    const res = await scrapeDepartments(faculty.abbrv);
    // eslint-disable-next-line no-console
    console.info(`SCRAPED ${res.length} DEPARTMENTS FOR ${faculty.abbrv}`);
    allDepartments.push({ faculty, departments: res });
  }
  return allDepartments;
};

const _scrapeRegistrationTerms = async () => {
  const faculties: {
    faculty: { name: string; abbrv: string };
    departments: { name: string; abbrv: string; terms?: { name: string; link: string }[] }[];
  }[] = await _getDepartments();
  for (let i = 0; i < faculties.length; i++) {
    const departments = faculties[i].departments;
    for (let j = 0; j < departments.length; j++) {
      const department = departments[j];
      const terms = await scrapeRegistrationTerms(department.abbrv);
      // eslint-disable-next-line no-console
      console.info(
        `SCRAPED ${terms.length} TERMS FOR ${department.abbrv}-${faculties[i].faculty.abbrv}`,
      );
      faculties[i].departments[j].terms = terms;
    }
  }
  fs.writeFileSync('plan-headers.json', JSON.stringify(faculties));
};

const _updateFacultiesCollection = async () => {
  const faculties: IFaculty[] = JSON.parse(fs.readFileSync('plan-headers.json').toString()).map(
    (f: any) => ({
      ...f,
      abbrv: f.faculty.abbrv,
      name: f.faculty.name,
    }),
  );
  await FacultySchema.deleteMany({});
  await FacultySchema.insertMany(faculties);
};

const _scrapePlan = async (departmentAbbrv: string, registrationTermLink: string) => {
  const planData = await scrapePlan(departmentAbbrv, registrationTermLink);
  fs.writeFileSync('plan-data.json', JSON.stringify(planData));
  return planData;
};

const _scrapeCourseBasic = async (code: string) => {
  const courseData = await scrapeCourseData(code);
  return courseData;
};

(async () => {
  const start = Date.now();
  const planLinks: {
    departmentAbbrv: string;
    registrationTermLink: string;
  }[] = JSON.parse(fs.readFileSync('plan-links.json').toString());
  for (const { departmentAbbrv, registrationTermLink } of planLinks.slice(74)) {
    const groups = await _scrapePlan(departmentAbbrv, registrationTermLink);
    // eslint-disable-next-line no-console
    console.info(`SCRAPED ${groups.length} GROUPS FOR ${departmentAbbrv}/${registrationTermLink}`);
    fs.appendFileSync(
      'plans.json',
      JSON.stringify({ departmentAbbrv, registrationTermLink, groups }) + ',',
    );
  }
  const end = Date.now();
  // eslint-disable-next-line no-console
  console.info(`Proccess duration: ${(end - start) / 1000} seconds`);
})();
