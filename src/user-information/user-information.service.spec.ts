import { Test, TestingModule } from '@nestjs/testing';
import { UserInformationService } from './user-information.service';

describe('UserInformationService', () => {
  let service: UserInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInformationService],
    }).compile();

    service = module.get<UserInformationService>(UserInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
