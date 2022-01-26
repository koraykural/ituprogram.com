import { CourseBasic, CourseDetails } from '../interfaces';
import { fetchDersBilgileri, fetchDersProgrami } from './fetches';
import { parseCourseBasic, parseDersProgrami } from './html-parsers';

export type ScrapeOpenCoursesResponse = { code: string; courses: CourseDetails[] }[];

export const scrapeOpenCourse = async (code: string): Promise<CourseDetails[]> => {
  const html = await fetchDersProgrami('LS', code);
  const courses = parseDersProgrami(html);
  return courses;
};

/**
 * Scrapes open courses for all given three letter codes ie. ATA
 *
 * @param   {string[]}  codes               Codes array
 *
 * @return  {ScrapeOpenCoursesResponse}     Array of code and courses
 */
export const scrapeOpenCourses = async (codes: string[]): Promise<ScrapeOpenCoursesResponse> => {
  const response: ScrapeOpenCoursesResponse = [];
  for (const code of codes) {
    // eslint-disable-next-line no-console
    console.info(`SCRAPING OPEN COURSES ${code}`);
    response.push({
      code,
      courses: await scrapeOpenCourse(code),
    });
  }
  return response;
};

export const scrapeCourseData = async (code: string): Promise<CourseBasic | null> => {
  const html = await fetchDersBilgileri(code);
  return parseCourseBasic(html);
};
