import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

const CodeSchema = new Schema({
  letter: String,
  course: [String],
});

export default mongoose.model<ICodeModel>('Code', CodeSchema);

export interface ICode {
  letter: string;
  course: string[];
}

export interface ICodeModel extends ICode, Document {}
