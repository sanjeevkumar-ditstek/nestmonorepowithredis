import { Module } from '@nestjs/common';
import { ResponseInterceptor } from './interceptor.service';

@Module({
  providers: [ResponseInterceptor],
  exports: [ResponseInterceptor],
})
export class InterceptorModule {}
