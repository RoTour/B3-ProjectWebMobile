import { Module } from '@nestjs/common';
import { DatabaseModule } from '@projetweb-b3/database';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
