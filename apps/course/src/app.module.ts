import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './schema/course.schema';
import { buyCourseSchema } from './schema/buyCourse.schema';
import { config } from 'dotenv';
import { LoggerService } from '@lib/logger';
import { MessageModule } from '@lib/message';
import { DBCollection } from 'libs/common/enum';
config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MongooseModule.forFeature([
      {
        name: DBCollection.Course,
        schema: CourseSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: DBCollection.BuyCourse,
        schema: buyCourseSchema,
      },
    ]),
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
