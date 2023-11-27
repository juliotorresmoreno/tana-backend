import { Injectable } from '@nestjs/common';
import { MmluService } from '../mmlu/mmlu.service';

@Injectable()
export class ConnectionsService {
  constructor(private mmluService: MmluService) {}

  findAll() {
    return this.mmluService.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} connection`;
  }
}
