import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  WebSocketGateway,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { AuthService } from 'src/resources/auth/auth.service';
import { Server, WebSocket } from 'ws';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private authService: AuthService) {}

  async handleConnection(socket: WebSocket, req: IncomingMessage) {
    const url = req.url.split('?');
    if (url.length !== 2) {
      socket.close();
      return;
    }
    this.verifySession(socket, url[1].substring(6));
  }

  async verifySession(socket: WebSocket, token: string) {
    const user = await this.authService.validateToken(token);

    if (user) return user;
    socket.close();
  }

  @SubscribeMessage('message')
  onEvent(socket: WebSocket, data: any) {
    console.log(data);
    this.server.clients.forEach((client) => {
      client.send(JSON.stringify({ event: 'message', data: 'sdfsd' }));
    });
  }
}
