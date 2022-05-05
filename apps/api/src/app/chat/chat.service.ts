import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Chatroom, User } from '@prisma/client';
import { PrismaService } from '@projetweb-b3/database';
import fs from 'fs/promises';
import { join, parse } from 'path';
import { UserService } from '../user/user.service';
@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async findOne(chatId: Chatroom['id']) {
    const chat = await this.prisma.chatroom.findFirst({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });
    return chat;
  }

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
    });
    return chats;
  }

  async uploadAvatar(chatId: Chatroom['id'], file: Express.Multer.File) {
    const extension = parse(file.originalname).ext;
    const p = join(__dirname, 'assets', 'chats', chatId.toString()) + extension;
    try {
      await fs.writeFile(p, file.buffer);

      const updated = await this.prisma.chatroom.update({
        where: {
          id: chatId,
        },
        data: {
          thumbnailUrl: join('cdn', 'chats', chatId.toString()) + extension,
        },
      });

      return updated;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
