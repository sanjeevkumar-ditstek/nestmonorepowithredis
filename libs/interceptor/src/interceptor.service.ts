import { ConfigService } from '@app/config';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { catchError, map, throwError, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable {
    return next.handle().pipe(
      map((data) => {
        if (typeof data == 'string') {
          throw {
            statusCode: HttpStatus.BAD_REQUEST,
            message: data,
          };
        } else {
          return {
            statusCode: HttpStatus.OK,
            ...data,
          };
        }
      }),
      catchError((error) => {
        let statusCode = HttpStatus.BAD_REQUEST;

        if (error instanceof BadRequestException) {
          statusCode = HttpStatus.BAD_REQUEST;
        }
        if (error instanceof InternalServerErrorException) {
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return throwError({
          statusCode,
          message: error.message,
        });
      }),
    );
  }
}

export class HelmetInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable {
    const request = context.switchToHttp().getRequest();
    request.headers['AppApiKey'] = new ConfigService().get('appApiKey');

    return next.handle();
  }
}

export class ApiKeyValidationMiddleware implements NestMiddleware {
  private readonly expectedApiKey = new ConfigService().get('appApiKey');

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['appapikey']) {
      throw new HttpException(
        'appApiKey field is required',
        HttpStatus.FORBIDDEN,
      );
    }

    const apiKey = req.headers['appapikey'];
    if (apiKey !== this.expectedApiKey) {
      throw new HttpException('Invalid App API key', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
