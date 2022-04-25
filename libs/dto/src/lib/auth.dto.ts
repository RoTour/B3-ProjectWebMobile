import { defaultValidationOptions } from './validation-util';
import { IsEmail, IsString } from 'class-validator';

export class JwtUserContent {
  id!: number;
  username!: string;
}

export class CredentialDto {
  accessToken!: string;
  user!: JwtUserContent;
}

export class LoginDto {
  @IsEmail(defaultValidationOptions)
  email!: string;

  @IsString(defaultValidationOptions)
  password!: string;
}


export class RegisterDto {
  @IsEmail(defaultValidationOptions)
  email!: string;

  @IsString(defaultValidationOptions)
  password!: string;

  @IsString(defaultValidationOptions)
  confirmPassword!: string;

  @IsString(defaultValidationOptions)
  username!: string;

  @IsString(defaultValidationOptions)
  name!: string;
}
