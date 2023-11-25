import { Module } from '@nestjs/common';
import { MmluService } from './mmlu.service';
import { MmluController } from './mmlu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mmlu } from 'src/entities/mmlu.entity';
import { AuthModule } from '../auth/auth.module';
import { MmluGateway } from './mmlu.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Mmlu]), AuthModule],
  controllers: [MmluController],
  providers: [MmluService, MmluGateway],
  exports: [MmluService],
})
export class MmluModule {}
