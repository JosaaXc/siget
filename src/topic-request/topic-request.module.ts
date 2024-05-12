import { Module } from '@nestjs/common';
import { TopicRequestService } from './topic-request.service';
import { TopicRequestController } from './topic-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicRequest } from './entities/topic-request.entity';
import { AuthModule } from '../auth/auth.module';
import { UserInformation } from '../user-information/entities/user-information.entity';
import { Topic } from '../topic/entities/topic.entity';

@Module({
  controllers: [TopicRequestController],
  providers: [TopicRequestService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      TopicRequest,
      Topic,
      UserInformation
    ])
  ]
})
export class TopicRequestModule {}
