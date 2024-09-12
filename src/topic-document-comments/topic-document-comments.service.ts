import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TopicDocumentComment } from './entities/topic-document-comment.entity';
import { CreateTopicDocumentCommentDto, UpdateTopicDocumentCommentDto } from './dto';
import { User } from '../auth/entities/user.entity';
import { UserInformation } from '../user-information/entities/user-information.entity';
import { UserIdPaginatedDto } from './dto/userId-paginated.dto';

@Injectable()
export class TopicDocumentCommentsService {

  constructor(
    @InjectRepository(TopicDocumentComment)
    private readonly topicDocumentCommentRepository: Repository<TopicDocumentComment>,
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
  ) {}

  async create({comment, topicDocument }: CreateTopicDocumentCommentDto, user: User) {
    try {
      const topicDocumentComment = this.topicDocumentCommentRepository.create({
        comment,
        topicDocument: { id: topicDocument },
        madeBy: { id: user.id }
      });
      return await this.topicDocumentCommentRepository.save(topicDocumentComment);

    } catch (error) {
      handleDBError(error);
    }
  }
  
  async findAllUsersThatCommented(topicDocumentId: string) {
    try {
      const userIds = await this.topicDocumentCommentRepository.createQueryBuilder("topicDocumentComment")
        .innerJoin("topicDocumentComment.madeBy", "user")
        .select(['user.id'])
        .where("topicDocumentComment.topicDocument = :id", { id: topicDocumentId })
        .groupBy("user.id")
        .getRawMany();
  
      const userInformationPromises = userIds.map(async (user) => {
        return await this.getUserInformation(user.user_id);
      });
  
      const usersInformation = await Promise.all(userInformationPromises);
  
      return usersInformation;
    } catch (error) {
      handleDBError(error);
    }
  }

  async findAllCommentsByTopicDocument( topicDocumentId:string , paginationDto: PaginationDto ) {
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

  async findAllCommentsByUser( topicDocumentId:string , userIdPaginatedDto: UserIdPaginatedDto ) {
    try {
      
      const { limit = 10, offset = 0, userId } = userIdPaginatedDto;
      const [result, total] = await this.topicDocumentCommentRepository.findAndCount({
        where: { 
          topicDocument: { id: topicDocumentId },
          madeBy: { id: userId }
        },
        order: { date: 'DESC' },
        take: limit,
        skip: offset
      });

      const userInformation = await this.getUserInformation(userId);

      return { userInformation, result, total };

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
  
  private async getUserInformation(userId: string) {
    return await this.userInformationRepository.createQueryBuilder("userInformation")
      .innerJoin("userInformation.user", "user", "user.id = :id", { id: userId })
      .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
      .getOne();
  }

}
