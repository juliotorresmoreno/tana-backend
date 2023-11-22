import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RedisService } from 'src/services/redis/redis.service';
import { User } from 'src/entities/user.entity';
import { RequestWithSession } from 'src/types/http';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async use(req: RequestWithSession, res: Response, next: NextFunction) {
    let token = req.headers.authorization || req.query.authorization;
    if (typeof token !== 'string') {
      next();
      return;
    }
    token = token.substring(0, 6) === 'Bearer' ? token.substring(7) : token;
    const sessionKey = `session:${token}`;
    const userId = await this.redisService.get(sessionKey);
    const session = userId
      ? await this.usersRepository.findOne({
          where: {
            id: Number.parseInt(userId),
            deleted_at: null,
          },
        })
      : null;
    if (session) {
      await this.redisService.set(sessionKey, userId);
      req.session = session;
      req.token = token;
    }
    next();
  }
}
