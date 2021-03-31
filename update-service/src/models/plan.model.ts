import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  link: String,
  groups: [
    {
      label: String,
      items: [
        {
          code: String,
          name: String,
          credits: Number,
          isOpened: Boolean,
        },
      ],
    },
  ],
});

export default mongoose.model<IPlanModel>("Plan", PlanSchema);

export interface IPlan {
  link: string;
  groups: [
    {
      label: string;
      items: [
        {
          code: string;
          name: string;
          credits: number;
          isOpened: boolean;
        }
      ];
    }
  ];
}

export interface IPlanModel extends IPlan, Document {}
