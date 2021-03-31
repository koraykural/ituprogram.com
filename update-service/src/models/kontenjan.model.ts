import { ObjectId } from "mongodb";
import { Schema, model, Document } from "mongoose";
import { IClass } from "./class.model";

const KontenjanSchema = new Schema({
  chat_id: String,
  crn: String,
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
  },
});

export default model<IKontenjan>("Kontenjan", KontenjanSchema);

export interface IKontenjan extends Document {
  chat_id: string;
  crn: string;
  class: ObjectId | IClass;
}
