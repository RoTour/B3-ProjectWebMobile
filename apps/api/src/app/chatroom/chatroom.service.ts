import { Injectable, NotFoundException } from '@nestjs/common';
import { Chatroom } from '@prisma/client';
import { PrismaService } from '@projetweb-b3/database';

@Injectable()
export class ChatroomService {

  constructor(private prisma: PrismaService) {
  }

  async getContent(chatroomId: number): Promise<Chatroom> {
    const chatroom = await this.prisma.chatroom.findUnique({ where: { id: chatroomId } });
    if (!chatroom) throw new NotFoundException("Chatroom not found");
    return chatroom;
  }
}
