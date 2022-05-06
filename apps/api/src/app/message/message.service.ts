import { Injectable } from '@nestjs/common';
import { Chatroom } from '@prisma/client';
import { PrismaService } from '@projetweb-b3/database';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async __mockData() {
    return this.prisma.message.create({
      data: {
        text: `Hello! (${Math.random()})`,
        chatroomId: 1,
        senderId: 1,
      },
    });
  }

  async getChat(chatId: Chatroom['id']) {
    return this.prisma.chatroom.findFirst({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });
  }

  async getMessages(chatId: Chatroom['id']) {
    return this.prisma.message.findMany({
      where: {
        chatroomId: chatId,
      },
      include: {
        sender: {
          select: {
            avatarUrl: true,
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async getMessagesAfter(chatId: Chatroom['id'], lastId: number) {
    return this.prisma.message.findMany({
      where: {
        chatroomId: chatId,
        id: {
          gt: lastId,
        },
      },
      include: {
        sender: {
          select: {
            avatarUrl: true,
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }
}
