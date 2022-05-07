import { IsInt, IsString } from 'class-validator';
import { defaultValidationOptions } from './validation-util';

export class SendMessageDto {
  @IsString(defaultValidationOptions)
  text!: string;

  @IsInt(defaultValidationOptions)
  chatroomId!: number;
}
