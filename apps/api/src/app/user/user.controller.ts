import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { CreateUserDto, JwtUserContent, SetNameDto, UserBanDto } from '@projetweb-b3/dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Post('/ban')
  banUser(@Body() banDto: UserBanDto) {
    return this.userService.ban(banDto)
  }

  // TODO: Use LoggedIn guard
  @Post("/set-name")
  setName(@Body() setNameDto: SetNameDto, @Request() req: Request & { user: JwtUserContent }) {
    return this.userService.setName(setNameDto, req.user);
  }

  // TODO: Use loggedIn guard
  @Get('/rooms')
  // getRooms(@Request() req: Request & { user: JwtUserContent }) {
  //   return this.userService.getRooms(req.user.id);
  // }
  getRooms(@Query('id') userId: string) {
    return this.userService.getRooms(+userId)
  }
}
