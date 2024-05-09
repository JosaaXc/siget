import { Module } from '@nestjs/common';
import { TopicRequestService } from './topic-request.service';
import { TopicRequestController } from './topic-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicRequest } from './entities/topic-request.entity';

@Module({
  controllers: [TopicRequestController],
  providers: [TopicRequestService],
  imports: [
    TypeOrmModule.forFeature([
      TopicRequest
    ])
  ]
})
export class TopicRequestModule {}
