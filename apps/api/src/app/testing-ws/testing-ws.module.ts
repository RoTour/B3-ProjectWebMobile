import { Module } from '@nestjs/common';
import { TestingWsGateway } from './testing-ws.gateway';

@Module({
  providers: [TestingWsGateway]
})
export class TestingWsModule {}
