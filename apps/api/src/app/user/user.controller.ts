import { Body, Controller, Post, Request } from '@nestjs/common';
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

  // TODO: Use Logged in guard
  @Post("/set-name")
  setName(@Body() setNameDto: SetNameDto, @Request() req: Request & { user: JwtUserContent }) {
    return this.userService.setName(setNameDto, req.user);
  }
}
