import { NextFunction, Request, Response, Router } from 'express';
import { getDepartments, getRegistrationTerms } from '../database';
import { getCourseBasics, getCourseDetails } from '../database/courses';

export const router = Router();

router.get('/departments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faculty = req.query.faculty as string;
    const departments = await getDepartments(faculty);
    res.status(200).json(departments);
  } catch (error) {
    next(error);
  }
});

router.get('/registration-terms', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const department = req.query.department as string;
    const registrationTerms = await getRegistrationTerms(department);
    res.status(200).json(registrationTerms);
  } catch (error) {
    next(error);
  }
});

router.post('/courses/details', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const codes = (req.query.codes as string).split(',');
    const courses = await getCourseDetails(codes);
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
});

router.post('/courses/basic', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const codes = (req.query.codes as string).split(',');
    const courses = await getCourseBasics(codes);
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
});

router.get('/plan/:department/:term', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(503);
  } catch (error) {
    next(error);
  }
});

router.get('/class/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(503);
  } catch (error) {
    next(error);
  }
});

router.get('/code/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(503);
  } catch (error) {
    next(error);
  }
});

router.get('/archive/:term/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(503);
  } catch (error) {
    next(error);
  }
});

router.get('/updateStatus', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(503);
  } catch (error) {
    next(error);
  }
});
