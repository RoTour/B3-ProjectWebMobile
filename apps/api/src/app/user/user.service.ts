import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@projetweb-b3/database';
import { CreateUserDto, UserBanDto } from '@projetweb-b3/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  // private logger = new Logger('UserService');

  constructor(private prisma: PrismaService) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash(createUserDto.password, await bcrypt.genSalt());
    const user = await this.prisma.user.create({ data: { ...createUserDto, password } });
    return { ...user, password: '' };
  }

  async ban(banDto: UserBanDto): Promise<User> {
    const user = await this.prisma.user.update({
      data: { banned: banDto.banned ?? true },
      where: { id: banDto.id },
    });
    return { ...user, password: '' }
  }
}
