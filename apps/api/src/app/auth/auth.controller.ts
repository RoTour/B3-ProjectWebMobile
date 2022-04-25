import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { CredentialDto, LoginDto, RegisterDto } from '@projetweb-b3/dto';
import { AuthService } from './auth.service';
import { SecuredUser } from '../user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<CredentialDto> {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<CredentialDto> {
    return await this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async decodeToken(@Req() req: Request & { user: SecuredUser }) {
    return req.user;
  }
}
