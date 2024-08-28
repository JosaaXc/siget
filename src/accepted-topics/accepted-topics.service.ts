import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { InjectRepository } from '@nestjs/typeorm';
import { AcceptedTopic } from './entities/accepted-topic.entity';
import { Repository } from 'typeorm';
import { UserInformation } from '../user-information/entities/user-information.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { DegreeProgramDto } from './dto/degree-program.dto';
import { UpdateAcceptedTopicDto } from './dto/update-accepted-topic.dto';

@Injectable()
export class AcceptedTopicsService {

  constructor(
    @InjectRepository(AcceptedTopic)
    private readonly acceptedTopicRepository: Repository<AcceptedTopic>, 
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll({limit = 10, offset = 0}: PaginationDto, { id }: User) {
    try {
  
      const query = this.acceptedTopicRepository.createQueryBuilder('acceptedTopic')
        .where('acceptedTopic.requestedBy = :id', { id })
        .orWhere('acceptedTopic.collaborator = :id', { id })
        .orWhere('acceptedTopic.acceptedBy = :id', { id })
        .leftJoinAndSelect('acceptedTopic.requestedBy', 'requestedBy')
        .leftJoinAndSelect('acceptedTopic.collaborator', 'collaborator')
        .leftJoinAndSelect('acceptedTopic.acceptedBy', 'acceptedBy')
        .leftJoinAndSelect('acceptedTopic.graduationOption', 'graduationOption')
        .skip(offset)
        .take(limit)
  
      const [items, total] = await query.getManyAndCount();
  
      const itemsWithUserInformation = await Promise.all(items.map(async (item) => {
        const requestedBy = await this.userInformationRepository.createQueryBuilder("userInformation")
          .innerJoin("userInformation.user", "user", "user.id = :id", { id: item.requestedBy.id })
          .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
          .getOne();
        
        const acceptedBy = await this.userInformationRepository.createQueryBuilder("userInformation")
          .innerJoin("userInformation.user", "user", "user.id = :id", { id: item.acceptedBy.id })
          .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
          .getOne();
      
        let collaborator = null;
        if (item.collaborator) {
          collaborator = await this.userInformationRepository.createQueryBuilder("userInformation")
            .innerJoin("userInformation.user", "user", "user.id = :id", { id: item.collaborator.id })
            .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
            .getOne();
        }
      
        return { ...item, requestedBy: { ...requestedBy, id: item.requestedBy.id }, acceptedBy: {...acceptedBy, id: item.acceptedBy.id },collaborator: collaborator ? { ...collaborator, id: item.collaborator.id } : null };
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

  async findStudents(user: User, paginationDto: PaginationDto, degreeProgramDto: DegreeProgramDto) {
    const { limit = 15, offset = 0 } = paginationDto; 
    const { degree } = degreeProgramDto;
    try {
      const studentsIds = await this.userRepository.createQueryBuilder('user')
        .select('user.id')
        .innerJoin('user.degreePrograms', 'degreeProgram')
        .where(':role = ANY(user.roles)', { role: ValidRoles.student })
        .andWhere('user.id != :userId', { userId: user.id })
        .andWhere('degreeProgram.id IN (:...degree)', { degree })
        .limit(limit)
        .skip(offset)
        .getMany();
  
      const acceptedTopicIds = await this.acceptedTopicRepository.createQueryBuilder('acceptedTopic')
        .select(['acceptedTopic.id', 'requestedBy.id', 'collaborator.id', 'acceptedBy.id']) // Modificado para seleccionar solo los ids
        .leftJoin('acceptedTopic.requestedBy', 'requestedBy')
        .leftJoin('acceptedTopic.collaborator', 'collaborator')
        .leftJoin('acceptedTopic.acceptedBy', 'acceptedBy')
        .getMany();
  
      const students = studentsIds.filter(student => {
        return !acceptedTopicIds.some(acceptedTopic => {
          return (acceptedTopic.requestedBy && acceptedTopic.requestedBy.id === student.id) ||
                 (acceptedTopic.collaborator && acceptedTopic.collaborator.id === student.id) ||
                 (acceptedTopic.acceptedBy && acceptedTopic.acceptedBy.id === student.id);
        });
      });
  
      const studentsWithUserInformation = await Promise.all(students.map(async (student) => {
        const userInformation = await this.userInformationRepository.createQueryBuilder("userInformation")
          .innerJoin("userInformation.user", "user", "user.id = :id", { id: student.id })
          .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
          .getOne();
      
        return { ...student, userInformation };
      }));
      return studentsWithUserInformation;
  
    } catch (error) {
      handleDBError(error);
    }
  }

  async update(id: string, updateAcceptedTopicDto: UpdateAcceptedTopicDto) {
    const { title, description, graduationOption } = updateAcceptedTopicDto;
    const currentTopic = await this.findOne(id);
    const updatedTopic = {
      title: title !== undefined ? title : currentTopic.title,
      description: description !== undefined ? description : currentTopic.description,
      graduationOption: graduationOption !== undefined ? { id: graduationOption } : currentTopic.graduationOption,
    };
  
    const result = await this.acceptedTopicRepository.update(id, updatedTopic);
    if (result.affected === 0) 
      throw new NotFoundException('Accepted Topic not found');
  
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.acceptedTopicRepository.delete(id);
    if(result.affected === 0) handleDBError(new Error('Accepted Topic not found'));
    return {
      message: 'Accepted Topic deleted successfully'
    }
  }
}
