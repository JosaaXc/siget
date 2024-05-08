import { Test, TestingModule } from '@nestjs/testing';
import { TopicScheduleController } from './topic-schedule.controller';
import { TopicScheduleService } from './topic-schedule.service';

describe('TopicScheduleController', () => {
  let controller: TopicScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicScheduleController],
      providers: [TopicScheduleService],
    }).compile();

    controller = module.get<TopicScheduleController>(TopicScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
