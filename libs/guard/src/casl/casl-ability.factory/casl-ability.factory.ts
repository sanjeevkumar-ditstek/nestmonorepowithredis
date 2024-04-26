import { Ability, AbilityBuilder, InferSubjects } from '@casl/ability';
import { Course, User } from './interface';

export type Subjects = InferSubjects<typeof Course | typeof User> | 'all';

// export type AppAbility = Ability<[Action, Subjects]>;

export class CaslAbilityFactory {
  defineAbility(permissions) {
    const { can, build } = new AbilityBuilder(Ability);
    permissions.forEach(({ resourse, action }) => {
      can(action, resourse);
    });

    return build({
      //   detectSubjectType: (item) =>
      //     item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
