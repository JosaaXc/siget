import { Controller } from '@nestjs/common';
import { AbandonedTopicService } from './abandoned-topic.service';

@Controller('abandoned-topic')
export class AbandonedTopicController {
  constructor(private readonly abandonedTopicService: AbandonedTopicService) {}
}
