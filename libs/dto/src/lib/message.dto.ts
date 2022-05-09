import { Message } from '@prisma/client';
import { IsInt, IsString } from 'class-validator';
import { defaultValidationOptions } from './validation-util';

export class SendMessageDto {
  @IsString(defaultValidationOptions)
  text!: string;

  @IsInt(defaultValidationOptions)
  chatroomId!: number;
}

export type MessageDataDto = Message & { sender: { id: number, name: string, username: string, avatarUrl: string } }
