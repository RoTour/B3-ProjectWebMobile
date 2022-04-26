import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CredentialDto, LoginDto, RegisterDto } from '@projetweb-b3/dto';
import { SecuredUser } from '../user/user.service';
import { AbilityFactory, Actions } from './ability/ability.factory';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private abilityFactory: AbilityFactory
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Query('admin') admin = false
  ): Promise<CredentialDto> {
    const creds = await this.authService.login(loginDto);
    if (admin) {
      const ability = this.abilityFactory.defineAbility(creds.user);
      if (ability.cannot(Actions.MANAGE, 'User')) {
        throw new UnauthorizedException();
      }
    }
    return creds;
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
