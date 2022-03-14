import { Controller, Get, Param } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';

@Controller('chatroom')
export class ChatroomController {

  constructor(private chatroomService: ChatroomService) {
  }

  // TODO: secure this by checking if user has access to this room before sending response
  @Get('/:id/content')
  getContent(@Param('id') chatroomId: string) {
    return this.chatroomService.getContent(+chatroomId);
  }
}
