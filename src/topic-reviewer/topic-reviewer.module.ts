import { Module } from '@nestjs/common';
import { TopicReviewerService } from './topic-reviewer.service';
import { TopicReviewerController } from './topic-reviewer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicReviewer } from './entities/topic-reviewer.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TopicReviewerController],
  providers: [TopicReviewerService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([TopicReviewer]),
  ],
})
export class TopicReviewerModule {}
