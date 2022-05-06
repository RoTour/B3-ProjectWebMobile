import { Module } from '@nestjs/common';
import { DatabaseModule } from '@projetweb-b3/database';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, DatabaseModule],
  imports: [DatabaseModule],
})
export class MessageModule {}
