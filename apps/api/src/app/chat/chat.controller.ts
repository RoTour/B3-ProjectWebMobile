import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Chatroom, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { AddUserToChatDto } from './dto/AddUserToChat.dto';
import { AvatarUploadDto } from './dto/AvatarUpload.dto';
import { CreateChatDto } from './dto/CreateChatDto';
import { Chat } from './schemas/Chat.schema';

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
    private readonly userService: UserService
  ) {}

  @ApiCreatedResponse({ description: 'Created', type: Chat })
  @ApiOperation({ summary: 'Create a chat' })
  @ApiBody({
    required: true,
    type: CreateChatDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createChat(
    @Body() body: CreateChatDto,
    @Req() req: Request & { user: User }
  ) {
    const user = await this.userService.findOneById(req.user.id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.chatService.createChat(user.id, body.title);
  }

  @ApiOkResponse({ description: 'Success', type: Chat })
  @ApiOperation({ summary: 'Join a chat' })
  @ApiBody({
    required: true,
    type: AddUserToChatDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/join')
  async joinChat(
    @Body('chatId', ParseIntPipe) chatId: AddUserToChatDto['chatId'],
    @Req() req: Request & { user: User }
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
  @Post('/leave')
  async leaveChat(
    @Body('chatId', ParseIntPipe) chatId: Chatroom['id'],
    @Req() req: Request & { user: User }
  ) {
    const user = await this.userService.findOneById(req.user.id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.chatService.removeUserFromChat(chatId, user.id);
  }

  @ApiOkResponse({ description: 'Success', type: [Chat] })
  @ApiOperation({ summary: 'Get all chats for user' })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getChatsForUser(@Req() req: Request & { user: User }) {
    const user = await this.userService.findOneById(req.user.id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.chatService.getChatsForUser(user.id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a new avatar for the chat',
    type: AvatarUploadDto,
  })
  @ApiParam({ name: 'chatId', type: 'integer', required: true })
  @UseInterceptors(FileInterceptor('file'))
  @Post('change-avatar/:chatId')
  async uploadFile(
    @UploadedFile() file: AvatarUploadDto['file'],
    @Req() req: Request & { user: User },
    @Param('chatId', ParseIntPipe) chatId: Chatroom['id']
  ) {
    if (file === undefined) {
      throw new BadRequestException();
    }
    const chat = await this.chatService.findOne(chatId);
    if (!chat) {
      throw new NotFoundException();
    }
    const userInChat = chat.users.find((u) => u.id === req.user.id);
    if (!userInChat) {
      throw new UnauthorizedException();
    }
    return await this.chatService.uploadAvatar(chatId, file);
  }
}
