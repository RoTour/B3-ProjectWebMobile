import { ApiProperty } from '@nestjs/swagger';
import { Chatroom } from '@prisma/client';

export class Chat implements Chatroom {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  title!: string;
  @ApiProperty()
  thumbnailUrl!: string;
}
