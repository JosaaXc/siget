import { Test, TestingModule } from '@nestjs/testing';
import { GraduationOptionsController } from './graduation-options.controller';
import { GraduationOptionsService } from './graduation-options.service';

describe('GraduationOptionsController', () => {
  let controller: GraduationOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraduationOptionsController],
      providers: [GraduationOptionsService],
    }).compile();

    controller = module.get<GraduationOptionsController>(GraduationOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
