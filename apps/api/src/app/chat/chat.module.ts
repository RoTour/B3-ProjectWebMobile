import { Module } from '@nestjs/common';
import { DatabaseModule } from '@projetweb-b3/database';
import { AbilityModule } from '../auth/ability/ability.module';
import { UserModule } from '../user/user.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
  imports: [DatabaseModule, AbilityModule, UserModule],
})
export class ChatModule {}
