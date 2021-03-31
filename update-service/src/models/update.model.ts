import mongoose, { Document, Model, Query } from "mongoose";
import { codeLetters } from "../consts";

const Schema = mongoose.Schema;

const UpdateSchema = new Schema({
  classes: [
    {
      _id: false,
      code: String,
      situation: String,
      last_update: Date,
    },
  ],
  plans: {
    situation: String,
    last_update: Date,
  },
  opened_classes: {
    situation: String,
    last_update: Date,
  },
});

UpdateSchema.statics.updateCode = async function (
  codeLetter: string,
  situation: string,
  success: boolean
) {
  let setObj = {};
  if (success) {
    setObj = {
      "classes.$": {
        code: codeLetter,
        situation,
        last_update: new Date(),
      },
    };
  } else {
    setObj = { "classes.$.situation": situation };
  }

  return this.updateOne({ "classes.code": codeLetter }, { $set: setObj }).exec();
};

export default mongoose.model<IUpdateDocument, IUpdateModel>("Update", UpdateSchema);

export interface IUpdate {
  classes: {
    code: string;
    situation: string;
    last_update: Date;
  }[];
  plans: {
    situation: string;
    last_update: Date;
  };
  opened_classes: {
    situation: string;
    last_update: Date;
  };
}

export interface IUpdateDocument extends IUpdate, Document {}

export interface IUpdateModel extends Model<IUpdateDocument> {
  updateCode(codeLetter: string, situation: string, success: boolean): any;
}
