import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { TestingWsModule } from './testing-ws/testing-ws.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, TestingWsModule, UserModule, ChatModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
