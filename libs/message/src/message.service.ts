import { Injectable } from '@nestjs/common';

const messages = {
  error: {
    emailExist: 'This email already exist!',
    invalidEmailPassword: 'invalid email and password',
    invalidOtp: 'otp is invalid',
    expireOtp: 'your otp is expire!',
    apiAbilityError: 'you have no permission to access private information!',
  },
  success: {
    signup: 'signup successfully',
    login: 'login successfully',
    verifyOtp: 'verify otp successfully',
    refreshToken: 'refresh token generated successfully',
  },
};

@Injectable()
export class MessageService {
  readonly message: object;
  constructor() {
    this.message = messages;
  }

  success(key: string): string {
    return this.message['success'][key];
  }
  error(key: string): string {
    return this.message['error'][key];
  }

  fetch(labal: string): string {
    return labal + ' fetch successfully';
  }

  delete(labal: string): string {
    return labal + ' delete successfully';
  }
}
