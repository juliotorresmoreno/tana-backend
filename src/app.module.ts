import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { ApiModule } from './api.module';
import { AuthMiddleware } from './resources/auth/auth.middleware';
import { RedisService } from './services/redis/redis.service';
import { User } from './entities/user.entity';
import configuration from './config/configuration';
import { Configuration } from './types/configuration';
import { Mmlu } from './entities/mmlu.entity';
import { MmluModule } from './resources/mmlu/mmlu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService<Configuration>) {
        const database = configService.get('database');
        const config = {
          type: database.driver,
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.name,
          entities: [User, Mmlu],
          synchronize: database.sync,
        } as TypeOrmModuleOptions;
        return config;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    ApiModule,
    MmluModule,
  ],
  controllers: [HealthcheckController],
  providers: [RedisService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
