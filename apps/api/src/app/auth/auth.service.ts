import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return this.usersService.secure(user);
    }
    return null;
  }
}
