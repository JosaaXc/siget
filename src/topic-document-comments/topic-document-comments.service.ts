import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TopicDocumentComment } from './entities/topic-document-comment.entity';
import { GetAllCommentsDto, CreateTopicDocumentCommentDto, UpdateTopicDocumentCommentDto } from './dto';

@Injectable()
export class TopicDocumentCommentsService {

  constructor(
    @InjectRepository(TopicDocumentComment)
    private readonly topicDocumentCommentRepository: Repository<TopicDocumentComment>,
  ) {}

  async create({comment, topicDocument }: CreateTopicDocumentCommentDto) {
    try {
      const topicDocumentComment = this.topicDocumentCommentRepository.create({
        comment,
        topicDocument: { id: topicDocument }
      });
      return await this.topicDocumentCommentRepository.save(topicDocumentComment);

    } catch (error) {
      handleDBError(error);
    }
  }

  async findAllCommentsByTopicDocument( { topicDocumentId }: GetAllCommentsDto, paginationDto: PaginationDto ) {
    try {
      
      const { limit = 10, offset = 0 } = paginationDto;
      const [result, total] = await this.topicDocumentCommentRepository.findAndCount({
        where: { topicDocument: { id: topicDocumentId } },
        order: { date: 'DESC' },
        take: limit,
        skip: offset
      });
      
      return { result, total }; 

    } catch (error) {
      handleDBError(error); 
    }
  }

  async findOne(id: string) {
    try {
      return await this.topicDocumentCommentRepository.findOneOrFail({ where: { id }});
    } catch (error) {
      handleDBError(error);
    }
  }

  async update(id: string, {comment}: UpdateTopicDocumentCommentDto) {
    try {
      
      await this.topicDocumentCommentRepository.update(id, {
        comment
      });
      return await this.topicDocumentCommentRepository.findOneOrFail({ where: { id }});

    } catch (error) {
      handleDBError(error);
    }
  }

  async remove(id: string) {
    const deletedComment = this.topicDocumentCommentRepository.delete(id);
    if( (await deletedComment).affected === 0 ) 
      throw new BadRequestException('The comment does not exist');
    return { message: 'Comment deleted successfully' }
  }
  
}
