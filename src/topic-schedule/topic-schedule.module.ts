import { Module } from '@nestjs/common';
import { TopicScheduleService } from './topic-schedule.service';
import { TopicScheduleController } from './topic-schedule.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicSchedule } from './entities/topic-schedule.entity';
import { Topic } from 'src/topic/entities/topic.entity';

@Module({
  controllers: [TopicScheduleController],
  providers: [TopicScheduleService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      TopicSchedule,
      Topic
    ])
  ]
})
export class TopicScheduleModule {}
