import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbandonedTopicService } from './abandoned-topic.service';
import { AbandonedTopicController } from './abandoned-topic.controller';
import { AbandonedTopic } from './entities/abandoned-topic.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AbandonedTopicController],
  providers: [AbandonedTopicService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      AbandonedTopic
    ]),
  ],
  exports: [TypeOrmModule]
})
export class AbandonedTopicModule {}
