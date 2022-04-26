import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserDto,
  JwtUserContent,
  SetNameDto,
  UserBanDto,
} from '@projetweb-b3/dto';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Res({ passthrough: true }) res: Response,
    @Query('page', ParseIntPipe) page: number,
    @Query('search') search: string
  ) {
    console.log(search);
    const totalCount = await this.userService.getTotalCount(search);
    console.log(totalCount);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.setHeader('x-total-count', totalCount);
    return this.userService.getPaginated(page - 1, search);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/ban')
  banUser(@Body() banDto: UserBanDto) {
    return this.userService.ban(banDto);
  }

  @Post('/unban')
  unbanUser(@Body() unbanDto: UserBanDto) {
    return this.userService.unban(unbanDto);
  }

  // TODO: Use Logged in guard
  @Post('/set-name')
  setName(
    @Body() setNameDto: SetNameDto,
    @Request() req: Request & { user: JwtUserContent }
  ) {
    return this.userService.setName(setNameDto, req.user);
  }
}
