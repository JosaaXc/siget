import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTopicReviewerDto } from './dto/create-topic-reviewer.dto';
import { UpdateTopicReviewerDto } from './dto/update-topic-reviewer.dto';
import { TopicReviewer } from './entities/topic-reviewer.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UserInformation } from '../user-information/entities/user-information.entity';

@Injectable()
export class TopicReviewerService {

  constructor(
    @InjectRepository(TopicReviewer)
    private topicReviewerRepository: Repository<TopicReviewer>,
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
  ) {}

  async create(createTopicReviewerDto: CreateTopicReviewerDto) {
    const { topicId, reviewerId } = createTopicReviewerDto;
    try {
      const topicReviewer = this.topicReviewerRepository.create({
        topicId: { id: topicId },
        reviewerId: { id: reviewerId },
      });
      const topic = await this.topicReviewerRepository.save(topicReviewer);
      const reviewerInformation = await this.getUserInformation(reviewerId);
      return {
        id: topic.id,
        topicId: topic.topicId.id,
        reviewerId: {
          id: reviewerId,
          ...reviewerInformation
        }
      };
    } catch (error) {
      handleDBError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 15, offset = 0 } = paginationDto;
    try {
      const topics = await this.topicReviewerRepository.find({
        skip: offset,
        take: limit,
      });
      return await Promise.all(topics.map(async topic => {
        const reviewerInformation = await this.getUserInformation(topic.reviewerId.id);
        return {
          id: topic.id,
          topicId: topic.topicId.id,
          reviewerId: {
            id: topic.reviewerId.id,
            ...reviewerInformation
          }
        };
      }));
    } catch (error) {
      handleDBError(error);
    }
  }

  async findOne(id: string) {
    try {
      const topic = await this.topicReviewerRepository.findOneOrFail({ where: { id } });
      const reviewerInformation = await this.getUserInformation(topic.reviewerId.id);
      return {
        id: topic.id,
        topicId: topic.topicId.id,
        reviewerId: {
          id: topic.reviewerId.id,
          ...reviewerInformation
        }
      };
    } catch (error) {
      handleDBError(error);
    }
  }

  async findByTopic(topicId: string) {
    try {
      const topics = await this.topicReviewerRepository.find({ where: { topicId: { id: topicId } } });
      return await Promise.all(topics.map(async topic => {
        const reviewerInformation = await this.getUserInformation(topic.reviewerId.id);
        return {
          id: topic.id,
          topicId: topic.topicId.id,
          reviewerId: {
            id: topic.reviewerId.id,
            ...reviewerInformation
          }
        };
      }));
    } catch (error) {
      handleDBError(error);
    }
  }

  async findByReviewer(reviewerId: string) {
    try {
      const topics = await this.topicReviewerRepository.find({ where: { reviewerId: { id: reviewerId } } });
      const reviewerInformation = await this.getUserInformation(reviewerId);
      return topics.map(topic => ({
        id: topic.id,
        topicId: topic.topicId.id,
        reviewerId: {
          id: reviewerId,
          ...reviewerInformation
        }
      }));
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
      const updatedTopic = await this.topicReviewerRepository.save(topicReviewer);
      const reviewerInformation = await this.getUserInformation(reviewerId);
      return {
        id: updatedTopic.id,
        topicId: updatedTopic.topicId.id,
        reviewerId: {
          id: reviewerId,
          ...reviewerInformation
        }
      };
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

  private async getUserInformation(userId: string) {
    return await this.userInformationRepository.createQueryBuilder("userInformation")
      .innerJoin("userInformation.user", "user", "user.id = :id", { id: userId })
      .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
      .getOne();
  }
}