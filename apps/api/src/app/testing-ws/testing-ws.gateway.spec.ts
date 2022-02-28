import { Test, TestingModule } from '@nestjs/testing';
import { TestingWsGateway } from './testing-ws.gateway';

describe('TestingWsGateway', () => {
  let gateway: TestingWsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestingWsGateway],
    }).compile();

    gateway = module.get<TestingWsGateway>(TestingWsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
