import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { ValidRoles } from '../auth/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { AcceptedTopic } from './entities/accepted-topic.entity';
import { Repository } from 'typeorm';
import { UserInformation } from '../user-information/entities/user-information.entity';

@Injectable()
export class AcceptedTopicsService {

  constructor(
    @InjectRepository(AcceptedTopic)
    private readonly acceptedTopicRepository: Repository<AcceptedTopic>, 
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
  ) {}

  findAll( paginationDto:PaginationDto, user: User ) {
    const roles = user.roles;

    try {
      
      if(roles.includes(ValidRoles.student)) 
        return this.findAcceptedTopicsByStudent( paginationDto, user );

      return this.findAcceptedTopicsBySupervisor( paginationDto, user );

    } catch (error) {
      handleDBError(error);
    }
  }

  async findAcceptedTopicsByStudent(paginationDto: PaginationDto, user: User) {
    try {
      const { id } = user;
      const { limit, offset } = paginationDto;

      const query = this.acceptedTopicRepository.createQueryBuilder('acceptedTopic');

      query.where('acceptedTopic.requestedBy = :id', { id });
      query.orWhere('acceptedTopic.collaborator = :id', { id });
      query.andWhere('acceptedTopic.proposedByRole = :role', { role: ValidRoles.student });

      query.skip(offset);
      query.take(limit);

      const [items, total] = await query.getManyAndCount();

      const itemsWithUserInformation = await Promise.all(items.map(async (item) => {
        const requestedBy = await this.userInformationRepository.findOne({ where: { user: item.requestedBy }, select: ['name', 'fatherLastName', 'motherLastName']});
        const collaborator = await this.userInformationRepository.findOne({ where: { user: item.collaborator }, select: ['name', 'fatherLastName', 'motherLastName']});
        return { ...item, requestedBy, collaborator };
      }));

      return { items: itemsWithUserInformation, total };
    } catch (error) {
      handleDBError(error);
    }
  }

  async findAcceptedTopicsBySupervisor(paginationDto: PaginationDto, user: User) {
    try {
      const { id } = user;
      const { limit, offset } = paginationDto;

      const query = this.acceptedTopicRepository.createQueryBuilder('acceptedTopic');

      query.where('acceptedTopic.acceptedBy = :id', { id });
      query.andWhere('acceptedTopic.proposedByRole = :role', { role: ValidRoles.asesor });

      query.skip(offset);
      query.take(limit);

      const [items, total] = await query.getManyAndCount();

      const itemsWithUserInformation = await Promise.all(items.map(async (item) => {
        const requestedBy = await this.userInformationRepository.findOne({ where: { user: item.requestedBy }, select: ['name', 'fatherLastName', 'motherLastName']});
        const collaborator = await this.userInformationRepository.findOne({ where: { user: item.collaborator }, select: ['name', 'fatherLastName', 'motherLastName']});
        return { ...item, requestedBy, collaborator };
      }));

      itemsWithUserInformation.forEach(item => delete item.proposedByRole);

      return { items: itemsWithUserInformation, total };

    } catch (error) {
      handleDBError(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.acceptedTopicRepository.findOneOrFail({where: {id}});
    } catch (error) {
      handleDBError(error);
    }
  }

  async remove(id: string) {
    const result = await this.acceptedTopicRepository.delete(id);
    if(result.affected === 0) handleDBError(new Error('Accepted Topic not found'));
    return {
      message: 'Accepted Topic deleted successfully'
    }
  }
}
