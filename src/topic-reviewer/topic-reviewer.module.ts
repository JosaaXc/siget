import { Module } from '@nestjs/common';
import { TopicReviewerService } from './topic-reviewer.service';
import { TopicReviewerController } from './topic-reviewer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicReviewer } from './entities/topic-reviewer.entity';

@Module({
  controllers: [TopicReviewerController],
  providers: [TopicReviewerService],
  imports: [
    TypeOrmModule.forFeature([TopicReviewer]),
  ],
})
export class TopicReviewerModule {}
