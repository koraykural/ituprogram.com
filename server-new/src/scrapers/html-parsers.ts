import fs from 'fs';
import cheerio from 'cheerio';
import { getCourseBasics } from '../database/courses';
import { CourseBasic, CourseDetails } from '../interfaces';

export const parseDersProgrami = async (html: string): Promise<CourseDetails[]> => {
  const $ = cheerio.load(html);
  const rows = $('table tr').toArray();
  rows.splice(0, 2); // Remove header rows

  // Create CourseBasic Map
  const codes = Array.from(
    new Set(rows.map((row) => $(row).find('td:nth-child(2)').text().trim())),
  );
  const courseBasicsArr = await getCourseBasics(codes);
  const courseBasics = new Map<string, CourseBasic>();
  courseBasicsArr.forEach((course) => courseBasics.set(course.code, course));

  return rows
    .map((row) => {
      const tds = $(row).find('td');
      const code = $(tds[1]).text().trim();
      const basicData = courseBasics.get(code) as CourseBasic;
      return {
        ...basicData,
        crn: $(tds[0]).text().trim(),
        lecturer: $(tds[3]).text().trim(),
        buildings: $(tds[4]).text().trim().split(' '),
        days: $(tds[5]).text().trim().split(' '),
        hours: $(tds[6]).text().trim().split(' '),
        room: $(tds[7]).text().trim(),
        capacity: parseInt($(tds[8]).text().trim()),
        enrolled: parseInt($(tds[9]).text().trim()),
        reservation: $(tds[10]).text().trim(),
        majorResctrictions: $(tds[11]).text().trim().split(' '),
      };
    })
    .filter((course) => course.code != null);
};

export const parseFaculties = (html: string): { name: string; abbrv: string }[] => {
  const $ = cheerio.load(html);
  const faculties: { name: string; abbrv: string }[] = [];
  const options = $('select[name="fakulte"] option');
  options.each((index, el) => {
    if (index === 0) {
      return;
    }
    faculties.push({
      abbrv: $(el).val(),
      name: $(el).text(),
    });
  });
  return faculties;
};

export const parseDepartments = (html: string): { name: string; abbrv: string }[] => {
  const $ = cheerio.load(html);
  const departments: { name: string; abbrv: string }[] = [];
  const options = $('select[name="program"] option');
  options.each((index, el) => {
    if (index === 0) {
      return;
    }
    departments.push({
      abbrv: $(el).val(),
      name: $(el).text(),
    });
  });
  return departments;
};

export const parseRegistrationTerms = (html: string): { name: string; link: string }[] => {
  const $ = cheerio.load(html);
  const anchors = $('div.content-area p a');
  const terms: { name: string; link: string }[] = [];
  anchors.each((_, el) => {
    terms.push({
      name: $(el).text().trim().replace(/\s\s+/g, ' '),
      link: $(el).attr('href')?.trim() as string,
    });
  });
  return terms;
};

export const parsePlanGroups = (
  html: string,
): {
  name: string;
  courseCodes: string[];
  subGroups: {
    name: string;
    url: string;
  }[];
}[] => {
  const $ = cheerio.load(html);
  const tables = $('div.table-responsive');
  const groups: {
    name: string;
    courseCodes: string[];
    subGroups: {
      name: string;
      url: string;
    }[];
  }[] = [];
  tables.each((_, table) => {
    const name = $(table.prev).text().trim();
    const codeTds = $('tr td:nth-child(1)', table);
    const courseCodes: string[] = [];
    codeTds.each((i, td) => {
      const codeText = $(td).text().trim();
      if (i === 0 || !codeText) {
        return;
      }
      if (codeText) {
        courseCodes.push(codeText);
      }
    });
    const nameTds = $('tr td:nth-child(2)', table);
    const subGroups: {
      name: string;
      url: string;
    }[] = [];
    nameTds.each((_, td) => {
      const anchorChild = $(td).children('a');
      if (anchorChild) {
        const name = anchorChild.text().trim();
        const url = anchorChild.attr('href');
        if (!name || !url) {
          return;
        }
        subGroups.push({ name, url });
      }
    });
    groups.push({
      name,
      courseCodes,
      subGroups,
    });
  });
  return groups;
};

export const parseCourseBasic = (html: string): CourseBasic | null => {
  const $ = cheerio.load(html);
  const isNull = $('b').first().text().includes('Kodlu Ders Bulunamadı');
  if (isNull) {
    return null;
  }
  const tables = $('table table');
  return {
    code: $('table:nth-child(1) tr:nth-child(2) td:nth-child(1)', tables).text().trim(),
    name: $('table:nth-child(1) tr:nth-child(2) td:nth-child(2)', tables).text().trim(),
    description: $('table:nth-child(4) tr:nth-child(2) td:nth-child(1)', tables)
      .text()
      .trim()
      .replace(/\n/g, ' '),
    credits: parseInt(
      $('table:nth-child(2) tr:nth-child(2) td:nth-child(1)', tables).text().trim(),
    ),
    coursePrerequisites: (
      $('table:nth-child(3) tr:nth-child(2) td:nth-child(2)', tables).html() as string
    )
      .split('<br>')
      .slice(0, -1),
    gradePrerequisite: $('table:nth-child(3) tr:nth-child(3) td:nth-child(2)', tables)
      .text()
      .trim(),
  };
};
