import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3334, {
  cors: {
    origin: '*',
  },
})
export class TestingWsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server | undefined;

  private logger: Logger = new Logger('AppGateway');


  afterInit(server: Server) {
    this.logger.log('Init');
    this.logger.log(server.path());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('events')
  handleEvents(@MessageBody() data: string): string {
    this.logger.log(data)
    this.server?.emit('events', data)
    return data
  }
}
