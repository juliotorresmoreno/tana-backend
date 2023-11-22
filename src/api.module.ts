import { Module } from '@nestjs/common';
import { AuthModule } from './resources/auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { AwsSnsModule } from './services/aws-sns/aws-sns.module';
import { SecureService } from './services/secure/secure.service';
import { SecureModule } from './services/secure/secure.module';
import { RedisModule } from './services/redis/redis.module';
import { AwsSesModule } from './services/aws-ses/aws-ses.module';
import { HbsRemplateModule } from './services/hbs-remplate/hbs-remplate.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AwsSnsModule,
    AwsSesModule,
    SecureModule,
    RedisModule,
    AwsSesModule,
    HbsRemplateModule,
  ],
  providers: [SecureService],
})
export class ApiModule {}
