import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Chatroom, User } from '@prisma/client';
import { concatMap, interval } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageService } from './message.service';
import { JwtUserContent, SendMessageDto } from '@projetweb-b3/dto';

@ApiTags('message')
@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/')
  async mockData() {
    return await this.messageService.__mockData();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/send')
  async sendMessage(@Body() sendMsgDto: SendMessageDto, @Req() req: Request & { user: JwtUserContent }) {
    return await this.messageService.sendMessage(sendMsgDto, req.user);
  }

  @Sse('/listen/:chatId')
  async listen(
    @Param('chatId', ParseIntPipe) chatId: Chatroom['id'],
    @Req() req: Request & { user: User },
  ) {
    const chat = await this.messageService.getChat(chatId);
    if (!chat) {
      throw new NotFoundException();
    }
    const isUserInChat = chat.users.some((user) => user.id === req.user.id);
    if (!isUserInChat) {
      throw new ForbiddenException();
    }

    let firstLoad = true;
    let lastId = 0;

    console.log(`should listen to ${ chatId }`);

    return interval(1000).pipe(
      concatMap(async () => {
        if (firstLoad) {
          firstLoad = false;
          const messages = await this.messageService.getMessages(chatId);
          lastId = messages[messages.length - 1]?.id ?? -1;
          const result = { messages };
          return { data: result };
        }
        const messages = await this.messageService.getMessagesAfter(
          chatId,
          lastId,
        );
        if (messages.length > 0) {
          lastId = messages[messages.length - 1]?.id ?? -1;
        }
        const result = { messages };
        return { data: result };
      }),
    );
  }
}
