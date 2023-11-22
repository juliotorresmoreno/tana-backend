import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketServer,
  WsResponse,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  @SubscribeMessage('events')
  onEvent(client: any, data: any) {
    this.server.clients.forEach((client) => {
      client.send(JSON.stringify({ event: 'events', data: 'sdfsd' }));
    });
  }
}
