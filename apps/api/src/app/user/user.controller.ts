import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto, JwtUserContent, SetNameDto, UserBanDto } from '@projetweb-b3/dto';
import { LocalGuard } from '../auth/guards/LocalGuard.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get()
  @UseGuards(LocalGuard)
  getUsers() {
    return [];
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/ban')
  banUser(@Body() banDto: UserBanDto) {
    return this.userService.ban(banDto);
  }

  // TODO: Use Logged in guard
  @Post('/set-name')
  setName(
    @Body() setNameDto: SetNameDto,
    @Request() req: Request & { user: JwtUserContent },
  ) {
    return this.userService.setName(setNameDto, req.user);
  }

  // TODO: Use loggedIn guard
  @Get('/rooms')
  // getRooms(@Request() req: Request & { user: JwtUserContent }) {
  //   return this.userService.getRooms(req.user.id);
  // }
  getRooms(@Query('id') userId: string) {
    return this.userService.getRooms(+userId);
  }
}
