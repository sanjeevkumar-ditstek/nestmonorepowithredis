import { DBCollection } from 'libs/common/enum';
import mongoose from 'mongoose';

export interface IPermissionSchema extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  resourse: string;
  actions: string[];
}
export const PermissionSchema = new mongoose.Schema<IPermissionSchema>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DBCollection.User,
    required: [true, 'userId field is required'],
  },

  resourse: {
    type: String,
    required: true,
  },
  actions: [
    {
      type: String,
      required: true,
    },
  ],
});
