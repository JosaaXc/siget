import { Test, TestingModule } from '@nestjs/testing';
import { DegreeProgramsController } from './degree-programs.controller';
import { DegreeProgramsService } from './degree-programs.service';

describe('DegreeProgramsController', () => {
  let controller: DegreeProgramsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DegreeProgramsController],
      providers: [DegreeProgramsService],
    }).compile();

    controller = module.get<DegreeProgramsController>(DegreeProgramsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
