import * as WebSocket from 'ws';
import {
  WebSocketAdapter,
  MessageEvent,
  Logger,
  INestApplication,
} from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';

export class WsAdapter implements WebSocketAdapter {
  private readonly logger = new Logger(WsAdapter.name);

  constructor(private app: INestApplication) {}

  create(port: number, options: any = {}): any {
    if (!port)
      return new WebSocket.Server({
        server: this.app.getHttpServer(),
        ...options,
      });

    return new WebSocket.Server({
      port: port,
      ...options,
    });
  }

  bindClientConnect(server, callback: Function) {
    server.on('connection', callback);
  }

  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    fromEvent(client, 'message')
      .pipe(
        mergeMap((data: MessageEvent) => {
          return this.bindMessageHandler(data, handlers);
        }),
        filter((result) => result),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }

  bindMessageHandler(
    buffer: MessageEvent,
    handlers: MessageMappingProperties[],
  ): Observable<any> {
    try {
      const message =
        typeof buffer.data !== 'object' ? JSON.parse(buffer.data) : buffer.data;

      const messageHandler = handlers.find(
        (handler) => handler.message === message.event,
      );

      if (!messageHandler) {
        return EMPTY;
      }

      messageHandler.callback(message.data);
      return EMPTY;
    } catch (error) {
      this.logger.error(error);
      return EMPTY;
    }
  }

  close(server) {
    server.close();
  }
}
