import { Module } from '@nestjs/common';
import { DatabaseModule } from '@projetweb-b3/database';
import { AbilityModule } from '../auth/ability/ability.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, AbilityModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
