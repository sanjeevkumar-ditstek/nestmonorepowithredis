import { DBCollection } from 'libs/common/enum';
import * as mongoose from 'mongoose';

export interface IBuyCourseSchema extends mongoose.Document {
  courseId: mongoose.Types.ObjectId;
  buyCourseBy: mongoose.Types.ObjectId;
}

export const buyCourseSchema = new mongoose.Schema<IBuyCourseSchema>({
  buyCourseBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.User,
    required: [true, 'buyCourseBy field is required'],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.Course,
    required: [true, 'courseId field is required'],
  },
});
