import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @EventPattern('signup')
  signup(req) {
    return this.appService.signup(req);
  }

  @MessagePattern('login')
  login(req) {
    return this.appService.login(req);
  }

  @MessagePattern({ cmd: 'verifyOtp' })
  verifyOtp(req) {
    return this.appService.verifyOtp(req);
  }

  @MessagePattern({ cmd: 'refreshToken' })
  refreshToken(req) {
    return this.appService.refreshToken(req);
  }

  @EventPattern('findPermissions')
  findPermissions(userId) {
    return this.appService.findPermissions(userId);
  }
}
