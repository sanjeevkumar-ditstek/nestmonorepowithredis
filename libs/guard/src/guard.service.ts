import { LoggerService } from '@lib/logger';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CaslAbilityFactory } from './casl/casl-ability.factory/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';
import {
  CHECK_ABILITY_KEY,
  RequiredRule,
} from './casl/casl-ability.factory/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { MicroService } from 'libs/common/enum';
import { Action } from './casl/casl-ability.factory/ability';
import { MessageService } from '@lib/message';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      request['user'] = payload;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(error);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class CaslAbilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: LoggerService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly message: MessageService,
    @Inject(MicroService.USER_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const ID = request.params.id || request.body.id;

      const user = request.user; // user is available on the request object
      const permissions = await this.userClient
        .send('findPermissions', user._id)
        .toPromise();

      const ability = this.caslAbilityFactory.defineAbility(permissions);
      const handler = this.reflector.get<RequiredRule[]>(
        CHECK_ABILITY_KEY,
        context.getHandler(),
      );

      if (!ability || !handler) return false;

      if (ID && handler.length > 1) {
        // if get id then check static for update
        const isAllowed = handler.some(({ subject }) => {
          return ability.can(Action.Update, subject);
        });
        if (isAllowed) return isAllowed;
        else
          throw new ForbiddenException(this.message.error('apiAbilityError'));
      } else {
        handler.forEach((rule) => {
          ForbiddenError.from(ability)
            .setMessage(this.message.error('apiAbilityError'))
            .throwUnlessCan(rule.action, rule.subject);
        });
      }

      return true;
    } catch (error) {
      this.logger.error(error.message);
      throw new ForbiddenException(error.message);
    }
  }
}
