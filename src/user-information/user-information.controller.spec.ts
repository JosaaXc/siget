import { Test, TestingModule } from '@nestjs/testing';
import { UserInformationController } from './user-information.controller';
import { UserInformationService } from './user-information.service';

describe('UserInformationController', () => {
  let controller: UserInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInformationController],
      providers: [UserInformationService],
    }).compile();

    controller = module.get<UserInformationController>(UserInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
