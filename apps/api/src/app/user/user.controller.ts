import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, UserBanDto } from '@projetweb-b3/dto';
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
}
