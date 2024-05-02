import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TopicController],
  providers: [TopicService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Topic
    ])
  ]
})
export class TopicModule {}
