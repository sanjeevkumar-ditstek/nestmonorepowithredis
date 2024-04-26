import { DBCollection } from 'libs/common/enum';
import * as mongoose from 'mongoose';

export interface ICourseSchema extends mongoose.Document {
  name: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  description: string;
  price: string;
  rating: string;
}

export const CourseSchema = new mongoose.Schema<ICourseSchema>({
  name: {
    type: String,
    required: [true, 'name field is required'],
  },
  description: {
    type: String,
    required: [true, 'description field is required'],
  },
  price: {
    type: String,
    required: [true, 'price field is required'],
  },
  rating: {
    type: String,
    default: '0',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.User,
    required: [true, 'createdBy field is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
