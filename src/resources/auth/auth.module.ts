import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AwsSnsService } from 'src/services/aws-sns/aws-sns.service';
import { SecureService } from 'src/services/secure/secure.service';
import { AwsSesService } from 'src/services/aws-ses/aws-ses.service';
import { RedisService } from 'src/services/redis/redis.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    AwsSnsService,
    AwsSesService,
    SecureService,
    RedisService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
