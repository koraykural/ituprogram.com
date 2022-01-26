import { Document as _, Schema, model } from 'mongoose';

export interface IFaculty {
  name: string;
  abbrv: string;
  departments: {
    name: string;
    abbrv: string;
    terms: {
      name: string;
      link: string;
    }[];
  }[];
}

const FacultySchema = new Schema<IFaculty>({
  name: String,
  abbrv: String,
  departments: [
    {
      _id: false,
      name: String,
      abbrv: String,
      terms: [
        {
          _id: false,
          name: String,
          link: String,
        },
      ],
    },
  ],
});

export default model<IFaculty>('Faculty', FacultySchema);
