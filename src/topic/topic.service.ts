import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ValidRoles } from '../auth/interfaces';
import { TopicState } from './interfaces/topic-state.interface';

@Injectable()
export class TopicService {

  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createTopicDto: CreateTopicDto, user: User) {
    
    
    await this.countTopicsByRoleOfUser(user);
    const { degreeProgram, graduationOption, collaborator,  ...dataTopic }  = createTopicDto;
    
    try {
      
      const topic = this.topicRepository.create({
        ...dataTopic,
        degreeProgram: { id: degreeProgram },
        graduationOption: { id: graduationOption}, 
        proposedBy: { id: user.id },
        collaborator: collaborator ? { id: collaborator } : null
      })

      const topicInserted =  await this.topicRepository
        .createQueryBuilder()
        .insert()
        .into(Topic)
        .values(topic)
        .execute();
      
      const idInserted = topicInserted.identifiers[0].id;
      return await this.topicRepository.findOneOrFail({ where: { id: idInserted } });

    } catch (error) {
      handleDBError(error);
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    // search all topics with state proposed
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      
      return await this.topicRepository.find({ 
        where: { state: TopicState.PROPOSED },
        relations: ['degreeProgram', 'graduationOption', 'proposedBy', 'collaborator'],
        take: limit,
        skip: offset
      });

    } catch (error) {
      handleDBError(error);
    }

  }

  async findOne(id: string) {
    try {
      
      return await this.topicRepository.findOneOrFail({ where: { id } });

    } catch (error) {
      handleDBError(error);
    }
  }

  async findMyTopics(user: User) {
    try {
      
      return await this.topicRepository.find({ where: { proposedBy: { id: user.id } }});

    } catch (error) {
      handleDBError(error);
    }
  }

  async update(id: string, updateTopicDto: UpdateTopicDto) {
    try {
    
      const { degreeProgram, graduationOption, collaborator, ...dataTopic } = updateTopicDto;
      const topic = this.topicRepository.create({
        ...dataTopic,
        degreeProgram: { id: degreeProgram },
        graduationOption: { id: graduationOption},
        collaborator: collaborator ? { id: collaborator } : null
      });

      await this.topicRepository
        .createQueryBuilder()
        .update(Topic)
        .set(topic)
        .where('id = :id', { id })
        .execute();
      
      const topicUpdated = await this.topicRepository.findOneOrFail({ where: { id } });
      delete topicUpdated.proposedBy;
      delete topicUpdated.collaborator.email;
      delete topicUpdated.collaborator.roles;
      return topicUpdated;
  
    } catch (error) {
      handleDBError(error);
    }
  }

  async remove(id: string) {
    try {
      
      await this.topicRepository.delete(id);
      return { message: 'Topic removed' };

    } catch (error) {
      handleDBError(error);
    }
  }

  private async countTopicsByRoleOfUser(user: User) {

    const userFound = await this.userRepository.findOneOrFail({ where: { id: user.id } });
    const roles = userFound.roles;

    if (roles.includes(ValidRoles.student)) {
      const topics = await this.topicRepository.find({ where: { proposedBy: userFound } });
      if (topics.length >= 2) 
        throw new BadRequestException('You can only propose two topics');
    }

    if (roles.includes(ValidRoles.asesor)) {
      const topics = await this.topicRepository.find({ where: { proposedBy: { id: userFound.id } } });
      if (topics.length >= 6) 
        throw new BadRequestException('You can only collaborate in six topics');
    }
  }

}
