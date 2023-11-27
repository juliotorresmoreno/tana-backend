import { v4 } from 'uuid';
import fetch from 'node-fetch';
import { ServerResponse } from 'http';
import { AnswerDto } from './mmlu.dto';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mmlu } from 'src/entities/mmlu.entity';
import { User } from 'src/entities/user.entity';
import { Ollama } from 'langchain/llms/ollama';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/types/configuration';
import { ChromaClient, IEmbeddingFunction } from 'chromadb';
import { FetchException } from 'src/common/exception';

class TanaAIEmbeddingFunction implements IEmbeddingFunction {
  private endpoint = '/ai/embeddings';
  constructor(private url: string) {}

  async embedDocuments(documents: string[]): Promise<number[][]> {
    return Promise.all(documents.map(this.embedQuery));
  }

  async embedQuery(document: string): Promise<number[]> {
    const response = await fetch(this.url + this.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ prompt: document }),
    });

    if (!response.ok) {
      throw new FetchException();
    }

    return response.json().catch((err) => {
      throw new FetchException();
    });
  }

  generate(texts: string[]): Promise<number[][]> {
    return this.embedDocuments(texts);
  }
}

@Injectable()
export class MmluService {
  private publicFields: (keyof Mmlu)[] = [
    'id',
    'name',
    'description',
    'feeling',
    'photo_url',
  ];

  chromadb: ChromaClient;
  model: Ollama;
  embeddings: TanaAIEmbeddingFunction;

  constructor(
    @InjectRepository(Mmlu) private readonly mmlusRepository: Repository<Mmlu>,
    private readonly configService: ConfigService<Configuration>,
  ) {
    this.model = new Ollama({
      baseUrl: configService.get('ollama').url,
      model: 'llama2',
    });
    this.chromadb = new ChromaClient({
      path: configService.get('chromadb').url,
    });
    this.embeddings = new TanaAIEmbeddingFunction(
      configService.get('tanaai').url,
    );
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

  async deleteHistory(user: User, botId: string) {
    return this.chromadb
      .deleteCollection({
        name: `conversation_${user.id}-${botId}`,
      })
      .then(() => {});
  }

  async getHistory(user: User, botId: string) {
    return (await this.getOrCreateHistory(user, botId)).get();
  }

  async answer(answer: AnswerDto, user: User, res: ServerResponse) {
    const human_date = new Date();
    const stream = await this.model.stream(answer.prompt);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);

      res.write(chunk);
      res.flushHeaders();
    }
    res.end();

    const system_date = new Date();

    const human = `Human: ${answer.prompt}`;
    const system = `System: ${chunks.join('')}`;
    const collection = await this.getOrCreateHistory(user, answer.id);

    const document = {
      ids: [v4(), v4()],
      metadatas: [
        { date: human_date.toISOString() },
        { date: system_date.toISOString() },
      ],
      documents: [human, system],
      embeddings: await this.embeddings.embedDocuments([human, system]),
    };
    await collection.add(document);
  }

  getOrCreateHistory(user: User, key: string) {
    return this.chromadb.getOrCreateCollection({
      name: `conversation_${user.id}-${key}`,
      embeddingFunction: this.embeddings,
    });
  }
}
