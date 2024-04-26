import { Module } from '@nestjs/common';
import { JoiValidationPipe } from './validation.service';

@Module({
  providers: [JoiValidationPipe],
  exports: [JoiValidationPipe],
})
export class ValidationModule {}
