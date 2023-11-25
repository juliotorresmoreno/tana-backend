import { Test, TestingModule } from '@nestjs/testing';
import { MmluService } from './mmlu.service';

describe('MmluService', () => {
  let service: MmluService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MmluService],
    }).compile();

    service = module.get<MmluService>(MmluService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
