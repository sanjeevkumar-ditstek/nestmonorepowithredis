import { Controller, Inject, Get, Param, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CaslAbilityGuard, AuthGuard } from '@lib/guard';
import { Action } from '@lib/guard/casl/casl-ability.factory/ability';
import { LoggerService } from '@lib/logger';
import { CheckAbilitires } from '@lib/guard/casl/casl-ability.factory/decorators';
import { MicroService } from 'libs/common/enum';
import { Course } from '@lib/guard/casl/casl-ability.factory/interface';

@UseGuards(AuthGuard, CaslAbilityGuard)
@Controller('course')
export class CourseController {
  constructor(
    readonly logger: LoggerService,
    @Inject(MicroService.COURSE_SERVICE)
    private readonly courseClient: ClientProxy,
  ) {}

  @SkipThrottle()
  @CheckAbilitires({ action: Action.Delete, subject: Course.name })
  @Get('all-courses')
  async gets() {
    return this.courseClient.send('allCourses', {}).toPromise();
  }

  @CheckAbilitires(
    { action: Action.Create, subject: 'course' },
    { action: Action.Update, subject: Course.name },
  )
  @Throttle({})
  @Get(':id')
  async get(@Param('id') courseId) {
    const data = await this.courseClient
      .send('courseById', { courseId })
      .toPromise();
    return data[0];
  }
}
