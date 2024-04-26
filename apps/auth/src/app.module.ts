import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientRegisters } from './clients/registers';
import { HelperService } from '@lib/helper';

@Module({
  imports: [...ClientRegisters],
  controllers: [AppController],
  providers: [AppService, HelperService],
})
export class AppModule {}
