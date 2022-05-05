import { ApiProperty } from '@nestjs/swagger';
import { Chatroom } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserToChatDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  chatId!: Chatroom['id'];
}
