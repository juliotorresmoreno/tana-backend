import { Test, TestingModule } from '@nestjs/testing';
import { MmluController } from './mmlu.controller';
import { MmluService } from './mmlu.service';

describe('MmluController', () => {
  let controller: MmluController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MmluController],
      providers: [MmluService],
    }).compile();

    controller = module.get<MmluController>(MmluController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
