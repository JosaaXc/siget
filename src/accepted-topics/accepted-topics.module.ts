import { Module } from '@nestjs/common';
import { AcceptedTopicsService } from './accepted-topics.service';
import { AcceptedTopicsController } from './accepted-topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptedTopic } from './entities/accepted-topic.entity';
import { AuthModule } from '../auth/auth.module';
import { AbandonedTopicModule } from '../abandoned-topic/abandoned-topic.module';

@Module({
  controllers: [AcceptedTopicsController],
  providers: [AcceptedTopicsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      AcceptedTopic,
    ]),
    AbandonedTopicModule,
  ]
})
export class AcceptedTopicsModule {}
