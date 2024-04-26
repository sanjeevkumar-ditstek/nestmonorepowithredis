import * as mongoose from 'mongoose';

export interface ICourseCategorySchema extends mongoose.Document {
  name: string;
  description: string;
  meta;
}

export const CourseCategorySchema = new mongoose.Schema<ICourseCategorySchema>(
  {
    name: {
      type: String,
      required: [true, 'name field is required'],
    },
    description: {
      type: String,
      required: [true, 'description field is required'],
    },
  },
  {
    timestamps: true, // Enable timestamps
  },
);
