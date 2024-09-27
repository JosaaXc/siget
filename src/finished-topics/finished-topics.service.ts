import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinishedTopic } from './entities/finished-topic.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { UserInformation } from '../user-information/entities/user-information.entity';
import { DegreeProgramDto } from '../accepted-topics/dto/degree-program.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class FinishedTopicsService {

  constructor(
    @InjectRepository(FinishedTopic)
    private readonly finishedTopicRepository: Repository<FinishedTopic>,
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
  ) {}


  async findByDegreeProgram({ degree }: DegreeProgramDto, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const finishedTopics = await this.finishedTopicRepository.createQueryBuilder('finishedTopic')
        .leftJoinAndSelect('finishedTopic.requestedBy', 'requestedBy')
        .leftJoinAndSelect('finishedTopic.collaborator', 'collaborator')
        .leftJoinAndSelect('finishedTopic.acceptedBy', 'acceptedBy')
        .leftJoinAndSelect('finishedTopic.degreeProgram', 'degreeProgram')
        .leftJoinAndSelect('finishedTopic.graduationOption', 'graduationOption')
        .where('finishedTopic.degreeProgramId IN (:...degree)', { degree })
        .orderBy('finishedTopic.finishedAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();
  
      const finishedTopicsWithUserInformation = await this.addUserInformationToTopics(finishedTopics);
  
      return finishedTopicsWithUserInformation;
  
    } catch (error) {
      handleDBError(error);
    }
  }

  async findOne(id: string) {
    try {
      const finishedTopic = await this.finishedTopicRepository.createQueryBuilder('finishedTopic')
        .where('finishedTopic.id = :id', { id })
        .leftJoinAndSelect('finishedTopic.requestedBy', 'requestedBy')
        .leftJoinAndSelect('finishedTopic.collaborator', 'collaborator')
        .leftJoinAndSelect('finishedTopic.acceptedBy', 'acceptedBy')
        .leftJoinAndSelect('finishedTopic.graduationOption', 'graduationOption')
        .getOne();
  
      if (!finishedTopic) throw new NotFoundException('Finished Topic not found');
  
      const finishedTopicWithUserInformation = await this.addUserInformationToTopics([finishedTopic]);
  
      return finishedTopicWithUserInformation[0];
  
    } catch (error) {
      handleDBError(error);
    }
  }

  private async addUserInformationToTopics(topics: any[]) {
    return await Promise.all(topics.map(async (topic) => {
      const requestedBy = await this.getUserInformation(topic.requestedBy.id);
      const acceptedBy = await this.getUserInformation(topic.acceptedBy.id);
      let collaborator = null;
      if (topic.collaborator) {
        collaborator = await this.getUserInformation(topic.collaborator.id);
      }
  
      return {
        ...topic,
        requestedBy: { ...requestedBy, id: topic.requestedBy.id },
        acceptedBy: { ...acceptedBy, id: topic.acceptedBy.id },
        collaborator: collaborator ? { ...collaborator, id: topic.collaborator.id } : null
      };
    }));
  }

  private async getUserInformation(userId: string) {
    return await this.userInformationRepository.createQueryBuilder("userInformation")
      .innerJoin("userInformation.user", "user", "user.id = :id", { id: userId })
      .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
      .getOne();
  }

}
