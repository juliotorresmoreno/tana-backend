import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { ApiModule } from './api.module';
import { AuthMiddleware } from './resources/auth/auth.middleware';
import { RedisService } from './services/redis/redis.service';
import { User } from './entities/user.entity';
import { EventsModule } from './services/events/events.module';
import getConfig from './config/configuration';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return getConfig().database;
      },
    }),
    TypeOrmModule.forFeature([User]),
    ApiModule,
    EventsModule,
  ],
  controllers: [HealthcheckController],
  providers: [RedisService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
