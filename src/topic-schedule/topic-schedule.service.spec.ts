import { Test, TestingModule } from '@nestjs/testing';
import { TopicScheduleService } from './topic-schedule.service';

describe('TopicScheduleService', () => {
  let service: TopicScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicScheduleService],
    }).compile();

    service = module.get<TopicScheduleService>(TopicScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
