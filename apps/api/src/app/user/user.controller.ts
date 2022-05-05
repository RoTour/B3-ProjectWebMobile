import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, JwtUserContent, SetNameDto, UserBanDto } from '@projetweb-b3/dto';
import type { Request, Response } from 'express';
import { AbilityFactory, Actions } from '../auth/ability/ability.factory';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private abilityFactory: AbilityFactory,
  ) {
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request & { user: JwtUserContent },
    @Query('page', ParseIntPipe) page: number,
    @Query('search') search: string,
  ) {
    const user = this.abilityFactory.defineAbility(req.user);
    if (user.cannot(Actions.MANAGE, 'User')) {
      throw new UnauthorizedException();
    }
    const totalCount = await this.userService.getTotalCount(search);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.setHeader('x-total-count', totalCount);
    return this.userService.getPaginated(page - 1, search);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/ban')
  @UseGuards(JwtAuthGuard)
  banUser(
    @Body() banDto: UserBanDto,
    @Req() req: Request & { user: JwtUserContent },
  ) {
    const user = this.abilityFactory.defineAbility(req.user);
    if (user.cannot(Actions.MANAGE, 'User')) {
      throw new UnauthorizedException();
    }
    return this.userService.ban(banDto);
  }

  @Post('/unban')
  @UseGuards(JwtAuthGuard)
  unbanUser(
    @Body() unbanDto: UserBanDto,
    @Req() req: Request & { user: JwtUserContent },
  ) {
    const user = this.abilityFactory.defineAbility(req.user);
    if (user.cannot(Actions.MANAGE, 'User')) {
      throw new UnauthorizedException();
    }
    return this.userService.unban(unbanDto);
  }

  @Post('/set-name')
  @UseGuards(JwtAuthGuard)
  setName(
    @Body() setNameDto: SetNameDto,
    @Req() req: Request & { user: JwtUserContent },
  ) {
    return this.userService.setName(setNameDto, req.user);
  }

  @Get('/rooms')
  @UseGuards(JwtAuthGuard)
  async getRooms(
    @Req() req: Request & { user: JwtUserContent },
  ) {
    console.log(req.user);
    return this.userService.getRooms(req.user);
  }
}
