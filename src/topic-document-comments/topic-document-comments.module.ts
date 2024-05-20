import { Module } from '@nestjs/common';
import { TopicDocumentCommentsService } from './topic-document-comments.service';
import { TopicDocumentCommentsController } from './topic-document-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicDocumentComment } from './entities/topic-document-comment.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TopicDocumentCommentsController],
  providers: [TopicDocumentCommentsService],
  imports: [
    TypeOrmModule.forFeature([
      TopicDocumentComment
    ]),
    AuthModule
  ]
})
export class TopicDocumentCommentsModule {}
