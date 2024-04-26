import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new JoiValidationPipe(headerValidation));
  await app.listen(new ConfigService().get('port'));
}

bootstrap();
