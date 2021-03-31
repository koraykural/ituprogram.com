import mongoose, { Document } from "mongoose";
import { IClass } from "./class.model";

const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  crn: String,
  code: String,
  name: String,
  lecturer: String,
  buildings: [String],
  days: [String],
  hours: [String],
  capacity: Number,
  enrolled: Number,
  restricts: [String],
  preReqs: [String],
});

const ArchiveSchema = new Schema({
  term: String,
  codeLetter: String,
  classes: [ClassSchema],
});

export default mongoose.model<IArchiveModel>("Archive", ArchiveSchema);

export interface IArchive {
  term: string;
  codeLetter: string;
  classes: IClass[];
}

export interface IArchiveModel extends IArchive, Document {}
