import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTopicReviewerDto } from './dto/create-topic-reviewer.dto';
import { UpdateTopicReviewerDto } from './dto/update-topic-reviewer.dto';
import { TopicReviewer } from './entities/topic-reviewer.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TopicReviewerService {

  constructor(
    @InjectRepository(TopicReviewer)
    private topicReviewerRepository: Repository<TopicReviewer>,
  ) {}

  async create(createTopicReviewerDto: CreateTopicReviewerDto) {
    const { topicId, reviewerId } = createTopicReviewerDto;
    try {
      const topicReviewer = this.topicReviewerRepository.create({
        topicId: { id: topicId },
        reviewerId: { id: reviewerId },
      });
      return await this.topicReviewerRepository.save(topicReviewer);
    } catch (error) {
      handleDBError(error);
    }
  }

  async findAll( paginationDto: PaginationDto ) {
    const { limit = 15, offset = 0 } = paginationDto;
    try {
      return await this.topicReviewerRepository.find({
        skip: offset,
        take: limit,
      });
    } catch (error) {
      handleDBError(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.topicReviewerRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      handleDBError(error);
    }
  }

  async findByTopic(topicId: string) {
    try {
      return await this.topicReviewerRepository.find({ where: { topicId: { id: topicId } } });
    } catch (error) {
      handleDBError(error);
    }
  }

  async findByReviewer(reviewerId: string) {
    try {
      return await this.topicReviewerRepository.find({ where: { reviewerId: { id: reviewerId } } });
    } catch (error) {
      handleDBError(error);
    }
  }

  async update(id: string, updateTopicReviewerDto: UpdateTopicReviewerDto) {
    const { reviewerId } = updateTopicReviewerDto;
    try {
      const topicReviewer = await this.topicReviewerRepository.preload({
        id: id,
        reviewerId: { id: reviewerId },
      });
      return await this.topicReviewerRepository.save(topicReviewer);
    } catch (error) {
      handleDBError(error);
    }
  } 

  async remove(id: string) {
    try {
      const topicReviewer = await this.topicReviewerRepository.delete(id);
      if (topicReviewer.affected === 0) {
        throw new Error('TopicReviewer not found');
      }
      return {
        message: 'TopicReviewer deleted successfully',
      }
    } catch (error) {
      handleDBError(error);
    }
  }
}
