import mongoose from 'mongoose';
import { MONGODB_URI } from './env';

import ArchiveModel from '../models/archive.model';
import ClassModel from '../models/class.model';
import CodeModel from '../models/code.model';
import PlanModel from '../models/plan.model';
import FacultyModel from '../models/faculty.model';
import SubjectModel from '../models/subject.model';
import UpdateModel from '../models/update.model';
import KontenjanModel from '../models/kontenjan.model';

mongoose.connect(MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;

export const ClassSchema = ClassModel;
export const ArchiveSchema = ArchiveModel;
export const CodeSchema = CodeModel;
export const PlanSchema = PlanModel;
export const SubjectSchema = SubjectModel;
export const UpdateSchema = UpdateModel;
export const KontenjanSchema = KontenjanModel;
export const FacultySchema = FacultyModel;
