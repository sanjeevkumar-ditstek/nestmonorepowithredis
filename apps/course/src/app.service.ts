import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICourseSchema } from './schema/course.schema';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { LoggerService } from '@lib/logger';
import { MessageService } from '@lib/message';
import { DBCollection } from 'libs/common/enum';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: LoggerService,
    private readonly message: MessageService,
    @InjectModel(DBCollection.Course)
    private readonly courseModel: Model<ICourseSchema>,
  ) {}

  async allCourses() {
    try {
      const aggregation = [
        {
          $lookup: {
            from: 'users',
            let: { userId: '$createdBy' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
              {
                $project: {
                  name: 1,
                  email: 1,
                },
              },
            ],
            as: 'courseCreatedBy',
          },
        },
        {
          $lookup: {
            from: 'buycourses',
            let: { courseId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$courseId', '$$courseId'] } } },
              {
                $lookup: {
                  from: 'users',
                  let: { userId: '$buyCourseBy' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                    {
                      $project: {
                        name: 1,
                        email: 1,
                        role: 1,
                      },
                    },
                  ],
                  as: 'studentDetail',
                },
              },
              { $unwind: '$studentDetail' },
            ],
            as: 'courseDetail',
          },
        },
        {
          $lookup: {
            from: 'lessions',
            let: { courseId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$courseId', '$$courseId'] } } },
              {
                $project: {
                  name: 1,
                  description: 1,
                },
              },
            ],
            as: 'lessions',
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            rating: 1,
            courseCreatedBy: 1,
            studentDetail: '$courseDetail.studentDetail',
            lessions: 1,
          },
        },
      ];
      const data = await this.courseModel.aggregate(aggregation);
      const message = this.message.fetch('Course');
      return { message, data };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  course(courseId) {
    const aggregation = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$createdBy' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            {
              $project: {
                name: 1,
                email: 1,
              },
            },
          ],
          as: 'courseCreatedBy',
        },
      },
      {
        $lookup: {
          from: 'buycourses',
          let: { courseId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$courseId', '$$courseId'] } } },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$buyCourseBy' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                  {
                    $project: {
                      name: 1,
                      email: 1,
                      role: 1,
                    },
                  },
                ],
                as: 'studentDetail',
              },
            },
            { $unwind: '$studentDetail' },
          ],
          as: 'courseDetail',
        },
      },
      {
        $lookup: {
          from: 'lessions',
          let: { courseId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$courseId', '$$courseId'] } } },
            {
              $project: {
                name: 1,
                description: 1,
              },
            },
          ],
          as: 'lessions',
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          rating: 1,
          courseCreatedBy: 1,
          studentDetail: '$courseDetail.studentDetail',
          lessions: 1,
        },
      },
    ];

    return this.courseModel.aggregate(aggregation);
  }
}
