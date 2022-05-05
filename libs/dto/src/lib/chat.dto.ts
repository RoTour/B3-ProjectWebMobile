import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title!: string;
}
