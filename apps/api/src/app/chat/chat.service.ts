import { Injectable, NotFoundException } from '@nestjs/common';
import { Chatroom, User } from '@prisma/client';
import { PrismaService } from '@projetweb-b3/database';
import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async createChat(userId: User['id'], chatName: string) {
    const chat = await this.prisma.chatroom.create({
      data: {
        title: chatName,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return chat;
  }

  async addUserToChat(chatId: Chatroom['id'], userId: User['id']) {
    const chat = await this.prisma.chatroom.findFirst({
      where: {
        id: chatId,
      },
    });
    if (!chat) {
      throw new NotFoundException();
    }
    const updated = await this.prisma.chatroom.update({
      where: {
        id: chatId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return updated;
  }

  async removeUserFromChat(chatId: Chatroom['id'], userId: User['id']) {
    const chat = await this.prisma.chatroom.findFirst({
      where: {
        id: chatId,
      },
    });
    if (!chat) {
      throw new NotFoundException();
    }
    const updated = await this.prisma.chatroom.update({
      where: {
        id: chatId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    return updated;
  }

  async getChatsForUser(userId: User['id']) {
    const chats = await this.prisma.chatroom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });
    return chats;
  }
}
