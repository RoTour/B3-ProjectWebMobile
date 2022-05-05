import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@projetweb-b3/database';
import {
  CreateUserDto,
  JwtUserContent,
  SetNameDto,
  UserBanDto,
} from '@projetweb-b3/dto';
import bcrypt from 'bcrypt';

export type SecuredUser = Omit<User, 'password'>;

@Injectable()
export class UserService {
  // private logger = new Logger('UserService');

  constructor(private prisma: PrismaService) {}

  secure(user: User): SecuredUser {
    const result: SecuredUser & { password: unknown } = { ...user };
    delete result.password;
    return result;
  }

  async getPaginated(page: number, search?: string): Promise<SecuredUser[]> {
    const where: Prisma.UserWhereInput = {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } },
      ],
    };
    const found = await this.prisma.user.findMany({
      take: 10,
      skip: 10 * page,
      where: search ? where : undefined,
    });
    return found.map((user) => this.secure(user));
  }

  async getTotalCount(search?: string) {
    const optional: { where: Prisma.UserWhereInput } = {
      where: {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { username: { contains: search } },
        ],
      },
    };
    const found = await this.prisma.user.count(search ? optional : undefined);
    return found;
  }

  async findOne(email: User['email']) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findOneById(id: User['id']) {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<SecuredUser> {
    const password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt()
    );
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password, banned: false },
    });
    return this.secure(user);
  }

  async ban(banDto: UserBanDto): Promise<SecuredUser> {
    const user = await this.prisma.user.update({
      data: { banned: true },
      where: { id: banDto.id },
    });
    return this.secure(user);
  }

  async unban(unbanDto: UserBanDto): Promise<SecuredUser> {
    const user = await this.prisma.user.update({
      data: { banned: false },
      where: { id: unbanDto.id },
    });
    return this.secure(user);
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
