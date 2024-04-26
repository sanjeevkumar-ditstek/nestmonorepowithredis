import { Module } from '@nestjs/common';
import { CaslModule } from './casl/casl.module';
import { AppService } from 'apps/user/src/app.service';
import { MessageService } from '@lib/message';

@Module({
  imports: [CaslModule],
  providers: [AppService, MessageService],
  exports: [],
})
export class GuardModule {}
