import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as winston from 'winston';
import * as NodeRSA from 'node-rsa';

import { Client } from '@elastic/elasticsearch';
import { Writable } from 'stream';
import { ConfigService } from '@app/config';

const esClient = new Client({ node: new ConfigService().get('esUrl') });

const consoleFormat = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({
      format: '- MM/DD/YYYY HH:mm:ss a',
    }),
    winston.format.colorize({}),
    winston.format.simple(),
    winston.format.json(),
    winston.format.printf((info) => {
      return `[\x1b[35mLogger\x1b[0m] ${info.timestamp} [${info.level}] ${info.message}`;
    }),
  ),
});

export class LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [consoleFormat],
    });
  }

  log = (message) => {
    message = `\x1b[32m${message}\x1b[0m`;
    this.logger.log({ level: 'info', message });
  };

  error = (message) => {
    message = `\x1b[31m${message}\x1b[0m`;
    this.logger.error({ level: 'error', message });
  };

  debug = (message: string) => {
    message = `\x1b[33m${message}\x1b[0m`;
    this.logger.error({ level: 'error', message });
  };
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private winstonLoggerErrorLevel = this.createSingleLineLogger('error');
  private winstonLoggerInfoLevel = this.createSingleLineLogger('info');

  createSingleLineLogger(logLevel: string) {
    const esStream = new Writable({
      write: (chunk, encoding, callback) => {
        esClient.index({
          index: 'logs',
          body: {
            message: chunk.toString(), // Convert chunk to string
          },
        });
        callback(); // Call the callback function to signal that the write operation is complete
      },
    });

    return winston.createLogger({
      level: logLevel,
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.Stream({
          stream: esStream,
        }),
      ],
    });
  }

  isErroneousStatusCode(statusCode: number) {
    return statusCode >= 400 && statusCode < 600;
  }

  /////////// encrypted to object function ///////////////////
  encryptObject(publicKey: string, body: object) {
    const key = new NodeRSA();
    key.importKey(publicKey, 'pkcs8-public-pem');
    return key.encrypt(JSON.stringify(body), 'base64');
  }
  ///////////////////////////////////////////////////////////

  encryptRequestBodyOnProduction(body: object) {
    if (process.env.NODE_ENV === 'production') {
      return this.encryptObject(process.env.LOGGER_RSA_KEY_PUBLIC, body);
    } else {
      return body;
    }
  }

  use(request: Request, response: Response, next: NextFunction): void {
    if (process.env.NODE_ENV !== 'local') {
      /* eslint-disable */
      const expressResponse = response as any;
      expressResponse.on('finish', () => {
        const { statusCode } = expressResponse;
        const contentLength = expressResponse.get('content-length');

        const basicRequestMetaInfo = {
          statusCode,
          contentLength,
          timestamp: new Date(),
        };

        if (this.isErroneousStatusCode(statusCode)) {
          const additionalRequestMetaInfo = {
            body: this.encryptRequestBodyOnProduction(request.body),
            headers: request.headers,
          };
          this.winstonLoggerErrorLevel.error({
            ...basicRequestMetaInfo,
            ...additionalRequestMetaInfo,
          });
        } else {
          this.winstonLoggerInfoLevel.info(basicRequestMetaInfo);
        }
      });
    }
    next();
  }
}
