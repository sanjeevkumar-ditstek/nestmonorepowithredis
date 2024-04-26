import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    new ConfigService().get('redisService'),
  );
  await app.listen();
}
bootstrap();
