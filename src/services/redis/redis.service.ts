import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/types/cache.service';
import {
  createClient,
  RedisClientOptions,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/types/configuration';

@Injectable()
export class RedisService implements CacheService {
  private redisClient: RedisClientType<
    RedisModules,
    RedisFunctions,
    RedisScripts
  >;
  private redisPub: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
  private redisSub: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  constructor(private configService: ConfigService<Configuration>) {
    const clientArgs: RedisClientOptions = {
      url: this.configService.get('redis').url,
    };

    this.redisClient = createClient(clientArgs);
    this.redisPub = createClient(clientArgs);
    this.redisSub = createClient(clientArgs);

    this.redisClient.connect();
    this.redisPub.connect();
    this.redisSub.connect();

    this.redisSub.on('error', function (err) {
      console.log(err);
    });
    this.redisPub.on('error', function (err) {
      console.log(err);
    });
    this.redisClient.on('error', function (err) {
      console.log(err);
    });

    this.redisClient.on('connection', function () {
      console.log('open');
    });
  }

  getClient() {
    return this.redisClient;
  }

  public async set(key: string, value: string): Promise<string> {
    return this.redisClient.set(key, value, { EX: 60 * 60 * 24 });
  }

  public async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  public async publish(key: string, value: string): Promise<void> {
    await this.redisClient.publish(key, value);
  }

  public async subscribe(
    key: string,
    fn: (reply: string) => void,
  ): Promise<void> {
    this.redisClient.subscribe(key, fn);
  }
}
