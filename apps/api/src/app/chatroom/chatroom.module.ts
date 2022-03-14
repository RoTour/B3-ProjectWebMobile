import { Module } from '@nestjs/common';
import { DatabaseModule } from '@projetweb-b3/database';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ChatroomController],
  providers: [ChatroomService],
})
export class ChatroomModule {}
