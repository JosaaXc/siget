import { Test, TestingModule } from '@nestjs/testing';
import { DegreeProgramsService } from './degree-programs.service';

describe('DegreeProgramsService', () => {
  let service: DegreeProgramsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DegreeProgramsService],
    }).compile();

    service = module.get<DegreeProgramsService>(DegreeProgramsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
