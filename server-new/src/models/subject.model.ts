import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  faculty: String,
  subject: {
    name: String,
    abbrv: String,
    links: [
      {
        _id: false,
        name: String,
        link: String,
      },
    ],
  },
});

export default mongoose.model<ISubjectModel>('Subject', SubjectSchema);

export interface ISubject {
  faculty: string;
  subject: {
    name: string;
    abbrv: string;
    links: [
      {
        name: string;
        link: string;
      },
    ];
  };
}

export interface ISubjectModel extends ISubject, Document {}
