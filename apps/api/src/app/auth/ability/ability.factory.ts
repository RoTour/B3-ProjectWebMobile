import { AbilityBuilder, AbilityClass } from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Chatroom, Message, User } from '@prisma/client';

export enum Actions {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}
export type PrismaAppAbility = PrismaAbility<
  [
    Actions,
    (
      | Subjects<{
          User: User;
          Chatroom: Chatroom;
          Message: Message;
        }>
      | 'all'
    )
  ]
>;

const AppAbility = PrismaAbility as AbilityClass<PrismaAppAbility>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: Readonly<Pick<User, 'id'>>) {
    const { can, cannot, build } = new AbilityBuilder(AppAbility);
    if (user.id <= 1) {
      can(Actions.MANAGE, 'all');
      // can(Actions.MANAGE, 'User');
      // can(Actions.MANAGE, 'Chatroom');
      // can(Actions.MANAGE, 'Message');
    } else {
      can(Actions.CREATE, 'Message');
      can(Actions.CREATE, 'Chatroom');

      can(Actions.READ, 'Message', {
        chatroom: { users: { some: { id: user.id } } },
      });
      can(Actions.READ, 'Chatroom', { users: { some: { id: user.id } } });
      can(Actions.READ, 'User');

      can(Actions.UPDATE, 'Message', { senderId: user.id });
      cannot(Actions.UPDATE, 'Chatroom');

      can(Actions.DELETE, 'Message', { senderId: user.id });
      cannot(Actions.DELETE, 'Chatroom');

      cannot(Actions.CREATE, 'User');
      cannot(Actions.UPDATE, 'User');
      cannot(Actions.DELETE, 'User');
    }
    return build({});
  }
}
