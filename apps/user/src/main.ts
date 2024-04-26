import { NestFactory } from '@nestjs/core';
import { UserModule } from './app.module';
import { ConfigService } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    UserModule,
    new ConfigService().get('redisService'),
  );
  await app.listen();
}
bootstrap();
