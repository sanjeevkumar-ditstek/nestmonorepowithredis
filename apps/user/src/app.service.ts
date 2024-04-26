import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserSchema } from './schemas/user.schema';
import { Model } from 'mongoose';
import { HelperService } from '@lib/helper';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '@lib/logger';
import * as bcrypt from 'bcrypt';
import { MessageService } from '@lib/message';
import { IPermissionSchema } from './schemas/userPermission.schema';
import { DBCollection } from 'libs/common/enum';

@Injectable()
export class AppService {
  constructor(
    private readonly helper: HelperService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
    private readonly message: MessageService,
    @InjectModel(DBCollection.User) readonly userModel: Model<IUserSchema>,
    @InjectModel(DBCollection.Permission)
    readonly permissionModel: Model<IPermissionSchema>,
  ) {}
  /**
   *
   * @param payload
   * @returns jwt token
   */
  generateAccessToken(payload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   *
   * @param payload
   * @returns jwt token
   */
  generateRefreshToken(payload): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  /**
   *
   * @param payload
   * @returns jwt token
   */
  refreshAccessToken(refreshToken: string): Promise<string> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET_KEY,
    });
    delete payload.exp;
    return this.generateAccessToken(payload);
  }

  /**
   *
   * @param req
   * @returns responce in object
   */
  async signup(req) {
    try {
      const { firstName, lastName, email, password, role } = req.body;

      let user = await this.userModel.findOne({ email });
      if (user) throw this.message.error('emailExist');

      const otp = this.helper.generateOtp(); // 4 digit otp generated
      const MINUTES = 5 * 60; // convert to second
      const CURRENT_TIME = Math.floor(new Date().getTime() / 1000);
      const otpExpireTime = CURRENT_TIME + MINUTES;

      //this.sendGrid.sendSMS(email, otp) // send otp by sendgrid
      const payload = {
        firstName,
        lastName,
        email,
        password,
        role,
        otp,
        otpExpireTime,
      };
      const saveuser = new this.userModel(payload);
      await saveuser.save();
      user = await this.userModel.findOne({ email }).lean();
      return { message: this.message.success('signup'), user };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
  /**
   *
   * @param req
   * @returns responce in object
   */
  async login(req) {
    try {
      const { email, password } = req.body;
      let message = this.message.error('invalidEmailPassword');
      const user = await this.userModel.findOne({ email }).lean();

      if (!user) throw message;

      // compare password (login)
      if (!(await bcrypt.compare(password, user.password))) throw message;

      const access_token = await this.generateAccessToken(user);
      const refresh_token = await this.generateRefreshToken(user);
      const data = { user, access_token, refresh_token };
      message = this.message.success('login');
      return { data, message };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  /**
   *
   * @param req
   * @returns user deatial with jwttoken and refresh token
   */
  async verifyOtp(req) {
    try {
      let message = this.message.error('invalidOtp');
      const user = await this.userModel.findOne({
        email: req.body.email,
        otp: req.body.otp,
      });
      if (!user) throw message;
      const CURRENT_TIME = Math.floor(new Date().getTime() / 1000);
      message = this.message.error('expireOtp');
      if (CURRENT_TIME > user.otpExpireTime) throw message;
      await this.userModel.findByIdAndUpdate(
        { otp: 0, isOtpVerify: true },
        { id: user.id },
      );
      const access_token = await this.generateAccessToken(user);
      const refresh_token = await this.generateRefreshToken(user);
      message = this.message.success('VerifyOtp');
      return { message, user, access_token, refresh_token };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  /**
   *
   * @param req
   * @returns generate refresh token
   */
  async refreshToken(refreshToken) {
    const token = await this.refreshAccessToken(refreshToken);
    return { message: this.message.success('refreshToken'), token };
  }

  async findPermissions(userId) {
    return this.permissionModel.find(
      { userId },
      { action: 1, resourse: 1, _id: 0 },
    );
  }
}
