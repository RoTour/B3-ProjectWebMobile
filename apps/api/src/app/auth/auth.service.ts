import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';
import { JwtUserContent, LoginDto, RegisterDto } from '@projetweb-b3/dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOne(email.toLowerCase());
    if (user && (await bcrypt.compare(pass, user.password))) {
      return this.usersService.secure(user);
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new NotFoundException('Invalid credentials');
    const payload: JwtUserContent = { username: user.username, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }

  async register(registerDto: RegisterDto) {
    if (registerDto.confirmPassword !== registerDto.password) {
      throw new BadRequestException('Passwords do not match');
    }
    if (await this.usersService.findOne(registerDto.email)) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create({
      email: registerDto.email.toLowerCase(),
      password: registerDto.password,
      username: registerDto.username,
      name: registerDto.name,
    });
    const payload: JwtUserContent = {
      id: user.id,
      username: user.username,
    }
    return { accessToken: this.jwtService.sign(payload) };
  }
}
