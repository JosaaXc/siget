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

  async findAll(paginationDto: PaginationDto, user: User) {
    try {
      const { id } = user;
      const { limit, offset } = paginationDto;
  
      const query = this.acceptedTopicRepository.createQueryBuilder('acceptedTopic');
  
      query.where('acceptedTopic.requestedBy = :id', { id });
      query.orWhere('acceptedTopic.collaborator = :id', { id });
      query.orWhere('acceptedTopic.acceptedBy = :id', { id });
  
      query.leftJoinAndSelect('acceptedTopic.requestedBy', 'requestedBy');
      query.leftJoinAndSelect('acceptedTopic.collaborator', 'collaborator');

      query.skip(offset);
      query.take(limit);
  
      const [items, total] = await query.getManyAndCount();
  
      const itemsWithUserInformation = await Promise.all(items.map(async (item) => {
        const requestedBy = await this.userInformationRepository.createQueryBuilder("userInformation")
          .innerJoin("userInformation.user", "user", "user.id = :id", { id: item.requestedBy.id })
          .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
          .getOne();
      
        const collaborator = await this.userInformationRepository.createQueryBuilder("userInformation")
          .innerJoin("userInformation.user", "user", "user.id = :id", { id: item.collaborator.id })
          .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
          .getOne();
      
        return { ...item, requestedBy: { ...requestedBy, id: item.requestedBy.id }, collaborator: { ...collaborator, id: item.collaborator.id } };
      }));

      itemsWithUserInformation.forEach(item => { delete item.proposedByRole; });
  
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
