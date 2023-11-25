import { ServerResponse } from 'http';

export abstract class Provider {
  async invoke(prompt: string, res: ServerResponse) {
    throw new Error('Method not implemented.');
  }
}
