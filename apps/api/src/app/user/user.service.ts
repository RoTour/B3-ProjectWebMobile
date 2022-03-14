import { Injectable } from '@nestjs/common';
import { Chatroom, User } from '@prisma/client';
import { PrismaService } from '@projetweb-b3/database';
import { CreateUserDto, JwtUserContent, SetNameDto, UserBanDto } from '@projetweb-b3/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  // private logger = new Logger('UserService');

  constructor(private prisma: PrismaService) {
  }

  secure(user: User): User {
    return { ...user, password: "" }
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

  setName(setNameDto: SetNameDto, user: JwtUserContent): Promise<User> {
    return this.prisma.user.update({
      data: { name: setNameDto.newName },
      where: { id: user.id },
    }).then((user: User) => this.secure(user))
  }

  async getRooms(userId: number): Promise<Chatroom[]> {
    return this.prisma.chatroom.findMany({
      select: { title: true, id: true },
      where: { users: { some: { id: userId } } }
    });
  }
}
