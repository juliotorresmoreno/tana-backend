import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mmlu } from 'src/entities/mmlu.entity';
import { Repository } from 'typeorm';
import { Ollama2 } from './provider/ollama2';
import { Provider } from './provider/provider';
import { ServerResponse } from 'http';
import { AnswerDto } from './mmlu.dto';
import { ChromaClient } from 'chromadb';
import { User } from 'src/entities/user.entity';

@Injectable()
export class MmluService {
  private publicFields: (keyof Mmlu)[] = [
    'id',
    'name',
    'description',
    'feeling',
    'photo_url',
  ];
  private provider: Provider;
  private client: ChromaClient;
  private embeddingFunction: any;

  constructor(
    @InjectRepository(Mmlu) private readonly mmlusRepository: Repository<Mmlu>,
  ) {
    this.provider = new Ollama2();
    this.client = new ChromaClient({
      path: 'MBZUAI/LaMini-Flan-T5-248M',
    });
  }

  findAll() {
    return this.mmlusRepository.find({
      select: this.publicFields,
      cache: 60 * 1000,
      where: {
        deleted_at: null,
      },
    });
  }

  findOne(id: number) {
    return this.mmlusRepository.findOne({
      select: this.publicFields,
      cache: 60 * 1000,
      where: { id, deleted_at: null },
    });
  }

  answer(answer: AnswerDto, user: User, res: ServerResponse) {
    const history = this.getOrCreateHistory(user, answer.id);
    return this.provider.invoke(answer.prompt, res);
  }

  getOrCreateHistory(user: User, key: string) {
    const keyId = [user.id, key].join('-');
    return this.client.getOrCreateCollection({
      name: keyId,
      embeddingFunction: this.embeddingFunction,
    });
  }
}
