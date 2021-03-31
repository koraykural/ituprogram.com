import mongoose, { Document, Model, MongooseUpdateQuery, Query } from "mongoose";

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
  credits: Number,
  restricts: [String],
  preReqs: [String],
  lastUpdatedAt: Date,
});

ClassSchema.statics.updateByCrn = async function (crn: string, document: MongooseUpdateQuery<any>) {
  return this.updateOne({ crn }, document, { upsert: true }).exec();
};

export default mongoose.model<IClassDocument, IClassModel>("Class", ClassSchema);

export interface IClass {
  crn: string;
  code: string;
  name: string;
  lecturer: string;
  buildings: string[];
  days: string[];
  hours: string[];
  capacity: number;
  enrolled: number;
  restricts: string[];
  preReqs: string[];
  credits?: number;
}

export interface IClassDocument extends IClass, Document {}

export interface IClassModel extends Model<IClassDocument> {
  updateByCrn(crn: string, document: MongooseUpdateQuery<IClass>): any;
}
