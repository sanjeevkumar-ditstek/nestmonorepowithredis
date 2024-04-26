import { AuthGuard } from '@lib/guard';
import {
  JoiValidationPipe,
  loginValidation,
  signupValidation,
} from '@lib/validation';
import {
  Controller,
  Post,
  Body,
  Inject,
  Request,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroService } from 'libs/common/enum';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(MicroService.USER_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  @Post('signup')
  @UsePipes(new JoiValidationPipe(signupValidation))
  async signup(@Body() req) {
    return this.userClient.send('signup', { body: req }).toPromise();
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(loginValidation))
  async login(@Body() req) {
    return this.userClient.send('login', { body: req }).toPromise();
  }

  @Post('verify-otp')
  async verifyOtp(@Body() req) {
    return this.userClient
      .send({ cmd: 'verifyOtp' }, { body: req })
      .toPromise();
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard)
  async refreshToken(@Request() req) {
    const [_, token] = req.headers.authorization?.split(' ') ?? [];
    console.log(_);
    return this.userClient.send({ cmd: 'refreshToken' }, token).toPromise();
  }
}
