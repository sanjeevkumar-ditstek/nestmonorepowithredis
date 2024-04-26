import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientRegisters } from './clients/registers';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { HelperService } from '@lib/helper';
import { JwtModule } from '@nestjs/jwt';
import { SmsService } from '@lib/sms';
import { LoggerService } from '@lib/logger';
import { ConfigService } from '@app/config';
import { MessageModule } from '@lib/message';
import { PermissionSchema } from './schemas/userPermission.schema';
import { CaslModule } from '@lib/guard/casl/casl.module';
import { DBCollection } from 'libs/common/enum';

@Module({
  imports: [
    ...ClientRegisters,
    MongooseModule.forRoot(new ConfigService().get('url')),
    MongooseModule.forFeature([
      {
        name: DBCollection.User,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: DBCollection.Permission,
        schema: PermissionSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: new ConfigService().get('jwtSecret'),
      signOptions: { expiresIn: new ConfigService().get('jwtExpireIn') },
    }),
    MessageModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelperService, SmsService, LoggerService],
})
export class UserModule {}
