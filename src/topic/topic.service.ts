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
import { ProposedByRole } from '../common/interfaces/proposed-by-role.interface';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TopicService {

  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly authService: AuthService
  ) {}

  async create(createTopicDto: CreateTopicDto, user: User) {
    
    const role = await this.countTopicsByRoleOfUser(user);
    const { degreeProgram, graduationOption, collaborator,  ...dataTopic }  = createTopicDto;
    
    try {
      
      const topic = this.topicRepository.create({
        ...dataTopic,
        degreeProgram: { id: degreeProgram },
        graduationOption: { id: graduationOption}, 
        proposedBy: { id: user.id },
        collaborator: collaborator ? { id: collaborator } : null,
        proposedByRole: role
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
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      return await this.topicRepository.find({ 
        relations: ['degreeProgram', 'graduationOption', 'proposedBy', 'collaborator'],
        take: limit,
        skip: offset
      });
    } catch (error) {
      handleDBError(error);
    }

  }

  async findAllTopicsByRole(paginationDto:PaginationDto, user: User) {
    const { userDegreePrograms } = await this.authService.getUser(user.id);
    const roles = user.roles; 
    if(roles.includes(ValidRoles.student)) 
      return await this.findAsesorTopics(paginationDto, userDegreePrograms.map( dp => dp.id ));
    return await this.findStudentsTopics(paginationDto, userDegreePrograms.map( dp => dp.id ));
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

  async findStudentsTopics(paginationDto: PaginationDto, userDegreePrograms: string[]) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      return await this.topicRepository.createQueryBuilder('topic')
        .innerJoinAndSelect('topic.degreeProgram', 'degreeProgram')
        .innerJoinAndSelect('topic.graduationOption', 'graduationOption')
        .innerJoinAndSelect('topic.proposedBy', 'proposedBy')
        .leftJoinAndSelect('topic.collaborator', 'collaborator')
        .where('topic.proposedByRole = :proposedByRole', { proposedByRole: ProposedByRole.student })
        .andWhere('degreeProgram.id IN (:...userDegreePrograms)', { userDegreePrograms })
        .skip(offset)
        .take(limit)
        .getMany();
    } catch (error) {
      handleDBError(error);
    }
  }

  async findAsesorTopics(paginationDto: PaginationDto, userDegreePrograms: string[]) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      return await this.topicRepository.createQueryBuilder('topic')
        .innerJoinAndSelect('topic.degreeProgram', 'degreeProgram')
        .innerJoinAndSelect('topic.graduationOption', 'graduationOption')
        .innerJoinAndSelect('topic.proposedBy', 'proposedBy')
        .leftJoinAndSelect('topic.collaborator', 'collaborator')
        .where('topic.proposedByRole = :proposedByRole', { proposedByRole: ProposedByRole.asesor })
        .andWhere('degreeProgram.id IN (:...userDegreePrograms)', { userDegreePrograms })
        .skip(offset)
        .take(limit)
        .getMany();
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

    const roles = user.roles; 

    if (roles.includes(ValidRoles.student)) {
      const topics = await this.topicRepository.find({ where: { proposedBy: user } });
      if (topics.length >= 2) 
        throw new BadRequestException('You can only propose two topics');
      return ProposedByRole.student;
    }
    return ProposedByRole.asesor;
  }

}
