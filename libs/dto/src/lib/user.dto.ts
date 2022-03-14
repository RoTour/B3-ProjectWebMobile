import { IsBoolean, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { defaultValidationOptions } from './validation-util';

export class CreateUserDto {
  @IsString(defaultValidationOptions)
  name!: string;

  @IsEmail(defaultValidationOptions)
  email!: string;

  @IsString(defaultValidationOptions)
  username!: string;

  @IsString(defaultValidationOptions)
  password!: string;
}

export class UserBanDto {
  @IsInt(defaultValidationOptions)
  id!: number;

  @IsBoolean(defaultValidationOptions)
  @IsOptional()
  banned = true;
}

export class SetNameDto {
  @IsString(defaultValidationOptions)
  newName!: string;
}
