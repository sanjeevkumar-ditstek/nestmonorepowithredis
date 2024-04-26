import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export interface IUserSchema extends mongoose.Document {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  role: string;
  otp: number;
  otpExpireTime: number;
  isOtpVerify: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  getEncryptedPassword: (password: string) => Promise<string>;
}

export const UserSchema = new mongoose.Schema<IUserSchema>({
  firstName: {
    type: String,
    required: [true, 'firstName field is required'],
  },
  lastName: {
    type: String,
    required: [true, 'lastName field is required'],
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'email can not be empty'],
    match: [
      /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email should be valid',
    ],
  },
  role: {
    type: String,
    required: [true, 'role can not be empty'],
    validate: {
      validator: function (value) {
        return ['student', 'teacher'].includes(value);
      },
      message: (props) => `${props.value} is not a valid role.`,
    },
  },
  password: {
    type: String,
    required: [true, 'Password can not be empty'],
    minlength: [6, 'Password should include at least 6 chars'],
  },
  otp: { type: Number },
  otpExpireTime: { type: Number },
  isOtpVerify: { type: Boolean },
});

UserSchema.methods.getEncryptedPassword = (
  password: string,
): Promise<string> => {
  return bcrypt.hash(String(password), SALT_ROUNDS);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await this.getEncryptedPassword(this.password);
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('firstName')) {
    return next();
  }
  this.name = this.firstName + ' ' + this.lastName;
  next();
});
