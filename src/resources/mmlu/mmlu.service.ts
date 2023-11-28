import { ServerResponse } from 'http';
import { AnswerDto } from './mmlu.dto';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mmlu } from 'src/entities/mmlu.entity';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/types/configuration';

@Injectable()
export class MmluService {
  private publicFields: (keyof Mmlu)[] = [
    'id',
    'name',
    'description',
    'feeling',
    'photo_url',
  ];

  constructor(
    @InjectRepository(Mmlu) private readonly mmlusRepository: Repository<Mmlu>,
    private readonly configService: ConfigService<Configuration>,
  ) {}

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

  async deleteHistory(user: User, botId: string) {}

  async getEmbeddings(answer: AnswerDto) {}

  async getHistory(user: User, botId: string) {}

  async answer(answer: AnswerDto, user: User, res: ServerResponse) {}
}
