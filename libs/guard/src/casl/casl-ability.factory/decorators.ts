import { SetMetadata } from '@nestjs/common';
import { Action } from './ability';
import { ConfigService } from '@app/config';

export interface RequiredRule {
  action: Action;
  subject: string;
}

export const CHECK_ABILITY_KEY = new ConfigService().get(
  'permissionAbilityKey',
);

export const CheckAbilitires = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY_KEY, requirements);
