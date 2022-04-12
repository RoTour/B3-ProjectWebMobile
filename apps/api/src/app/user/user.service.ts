import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@projetweb-b3/database';
import {
  CreateUserDto,
  JwtUserContent,
  SetNameDto,
  UserBanDto,
} from '@projetweb-b3/dto';
import bcrypt from 'bcrypt';

type SecuredUser = Omit<User, 'password'>;
@Injectable()
export class UserService {
  // private logger = new Logger('UserService');

  constructor(private prisma: PrismaService) {}

  secure(user: User): SecuredUser {
    const result: SecuredUser & { password: unknown } = { ...user };
    delete result.password;
    return result;
  }

  async findOne(email: User['email']) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt()
    );
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password, banned: false },
    });
    return { ...user, password: '' };
  }

  async ban(banDto: UserBanDto): Promise<User> {
    const user = await this.prisma.user.update({
      data: { banned: banDto.banned ?? true },
      where: { id: banDto.id },
    });
    return { ...user, password: '' };
  }

  setName(setNameDto: SetNameDto, user: JwtUserContent): Promise<SecuredUser> {
    return this.prisma.user
      .update({
        data: { name: setNameDto.newName },
        where: { id: user.id },
      })
      .then((user: User) => this.secure(user));
  }
}
