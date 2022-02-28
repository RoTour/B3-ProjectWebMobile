import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestingWsModule } from './testing-ws/testing-ws.module';

@Module({
  imports: [TestingWsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
