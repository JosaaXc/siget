import { Module } from '@nestjs/common';
import { FinishedTopicsService } from './finished-topics.service';
import { FinishedTopicsController } from './finished-topics.controller';
import { FinishedTopic } from './entities/finished-topic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FinishedTopicsController],
  providers: [FinishedTopicsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      FinishedTopic
    ]),
  ],
})
export class FinishedTopicsModule {}
