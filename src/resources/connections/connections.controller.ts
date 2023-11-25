import { Controller, Get, Param, Request } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { RequestWithSession } from 'src/types/http';
import { Authentication } from 'src/utils/secure';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  @Authentication()
  findAll(@Request() req: RequestWithSession) {
    return this.connectionsService.findAll();
  }

  @Get(':id')
  @Authentication()
  findOne(@Request() req: RequestWithSession, @Param('id') id: string) {
    return this.connectionsService.findOne(+id);
  }
}
