import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async signup(req) {
    console.log('IN AUTH');
    return await this.userClient.send('allCourses', req).toPromise();
  }

  async login(req) {
    return this.userClient.send('login', req).toPromise();
  }

  async verifyOtp(req) {
    return this.userClient.send({ cmd: 'verifyOtp' }, req).toPromise();
  }

  async refreshToken(req) {
    return this.userClient.send({ cmd: 'refreshToken' }, req).toPromise();
  }
}
