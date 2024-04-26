import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientRegisters } from './clients/registers';
import { AuthController } from './apiControllers/auth.controller';
import { CourseController } from './apiControllers/cource.controller';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import helmet from 'helmet';
import {
  ApiKeyValidationMiddleware,
  HelmetInterceptor,
  ResponseInterceptor,
} from '@lib/interceptor';
import { LoggerMiddleware, LoggerService } from '@lib/logger';
import { CaslAbilityFactory } from '@lib/guard/casl/casl-ability.factory/casl-ability.factory';
import { MessageService } from '@lib/message';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@app/config';

@Module({
  imports: [
    ...ClientRegisters,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // time limit in milisecond
        limit: 5, // request limit by ttl time
      },
    ]),
    ElasticsearchModule.registerAsync({
      useFactory: async () => ({
        node: new ConfigService().get('esUrl'),
        auth: {
          username: '',
          password: '',
        },
      }),
    }),
  ],
  controllers: [AuthController, CourseController],
  providers: [
    JwtService,
    LoggerService,
    CaslAbilityFactory,
    MessageService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HelmetInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet.contentSecurityPolicy()).forRoutes('*');
    consumer.apply(ApiKeyValidationMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
