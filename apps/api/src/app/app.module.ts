import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestingWsModule } from './testing-ws/testing-ws.module';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [TestingWsModule, UserModule, ChatroomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
