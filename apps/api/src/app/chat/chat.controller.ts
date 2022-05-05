import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Chatroom, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { CreateChatDto } from '@projetweb-b3/dto';

class Chat implements Chatroom {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  title!: string;
  thumbnailUrl = '';
}

@ApiBearerAuth()
@ApiTags('chat')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiNotFoundResponse({ description: 'Not found' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {
  }

  @ApiCreatedResponse({ description: 'Created', type: Chat })
  @ApiOperation({ summary: 'Create a chat' })
  @ApiBody({
    required: true,
    type: CreateChatDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createChat(
    @Body() body: CreateChatDto,
    @Req() req: Request & { user: User },
  ) {
    const user = await this.userService.findOneById(req.user.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return await this.chatService.createChat(user.id, body.title);
  }

  @ApiOkResponse({ description: 'Success', type: Chat })
  @ApiOperation({ summary: 'Join a chat' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('/join')
  async joinChat(
    @Body('chatId', ParseIntPipe) chatId: Chatroom['id'],
    @Req() req: Request & { user: User },
  ) {
    const user = await this.userService.findOneById(req.user.id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.chatService.addUserToChat(chatId, user.id);
  }

  @ApiOkResponse({ description: 'Success', type: Chat })
  @ApiOperation({ summary: 'Leave a chat' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('/leave')
  async leaveChat(
    @Body('chatId', ParseIntPipe) chatId: Chatroom['id'],
    @Req() req: Request & { user: User },
  ) {
    const user = await this.userService.findOneById(req.user.id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.chatService.removeUserFromChat(chatId, user.id);
  }

  @ApiOkResponse({ description: 'Success', type: [Chat] })
  @ApiOperation({ summary: 'Get all chats for user' })
  @ApiParam({
    name: 'userId',
    type: 'number',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  async getChatsForUser(
    @Param('userId', ParseIntPipe) userId: User['id'],
    @Req() req: Request & { user: User },
  ) {
    const user = await this.userService.findOneById(req.user.id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.chatService.getChatsForUser(user.id);
  }
}
