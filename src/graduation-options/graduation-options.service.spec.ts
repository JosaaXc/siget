import { Test, TestingModule } from '@nestjs/testing';
import { GraduationOptionsService } from './graduation-options.service';

describe('GraduationOptionsService', () => {
  let service: GraduationOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraduationOptionsService],
    }).compile();

    service = module.get<GraduationOptionsService>(GraduationOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
