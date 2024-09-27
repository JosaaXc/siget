import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { InjectRepository } from '@nestjs/typeorm';
import { AcceptedTopic } from './entities/accepted-topic.entity';
import { Repository } from 'typeorm';
import { UserInformation } from '../user-information/entities/user-information.entity';
import { ValidRoles } from '../auth/interfaces';
import { DegreeProgramDto } from './dto/degree-program.dto';
import { UpdateAcceptedTopicDto } from './dto/update-accepted-topic.dto';
import { FinishedTopic } from '../finished-topics/entities/finished-topic.entity';

@Injectable()
export class AcceptedTopicsService {

  constructor(
    @InjectRepository(AcceptedTopic)
    private readonly acceptedTopicRepository: Repository<AcceptedTopic>, 
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FinishedTopic)
    private finishedTopicRepository: Repository<FinishedTopic>,

  ) {}

  async findAll({ limit = 10, offset = 0 }: PaginationDto, { id }: User) {
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
        .take(limit);
  
      const [items, total] = await query.getManyAndCount();
  
      const itemsWithUserInformation = await this.addUserInformationToTopics(items);
  
      return { items: itemsWithUserInformation, total };
  
    } catch (error) {
      handleDBError(error);
    }
  }

  async findByDegreeProgram({ degree }: DegreeProgramDto) {
    try {
      const acceptedTopics = await this.acceptedTopicRepository.createQueryBuilder('acceptedTopic')
        .leftJoinAndSelect('acceptedTopic.requestedBy', 'requestedBy')
        .leftJoinAndSelect('acceptedTopic.collaborator', 'collaborator')
        .leftJoinAndSelect('acceptedTopic.acceptedBy', 'acceptedBy')
        .leftJoinAndSelect('acceptedTopic.degreeProgram', 'degreeProgram')
        .leftJoinAndSelect('acceptedTopic.graduationOption', 'graduationOption')
        .where('acceptedTopic.degreeProgramId IN (:...degree)', { degree })
        .getMany();
  
      const acceptedTopicsWithUserInformation = await this.addUserInformationToTopics(acceptedTopics);
  
      return acceptedTopicsWithUserInformation;
  
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
        .select(['acceptedTopic.id', 'requestedBy.id', 'collaborator.id', 'acceptedBy.id'])
        .leftJoin('acceptedTopic.requestedBy', 'requestedBy')
        .leftJoin('acceptedTopic.collaborator', 'collaborator')
        .leftJoin('acceptedTopic.acceptedBy', 'acceptedBy')
        .getMany();
  
      const students = this.filterStudentsNotInAcceptedTopics(studentsIds, acceptedTopicIds);
  
      const studentsWithUserInformation = await this.addUserInformationToStudents(students);
  
      return studentsWithUserInformation;
  
    } catch (error) {
      handleDBError(error);
    }
  }

  async findOne(id: string) {
    try {
      const acceptedTopic = await this.acceptedTopicRepository.createQueryBuilder('acceptedTopic')
        .where('acceptedTopic.id = :id', { id })
        .leftJoinAndSelect('acceptedTopic.requestedBy', 'requestedBy')
        .leftJoinAndSelect('acceptedTopic.collaborator', 'collaborator')
        .leftJoinAndSelect('acceptedTopic.acceptedBy', 'acceptedBy')
        .leftJoinAndSelect('acceptedTopic.graduationOption', 'graduationOption')
        .getOne();
  
      if (!acceptedTopic) throw new NotFoundException('Accepted Topic not found');
  
      const acceptedTopicWithUserInformation = await this.addUserInformationToTopics([acceptedTopic]);
  
      return acceptedTopicWithUserInformation[0];
  
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
  
  private async addUserInformationToStudents(students: any[]) {
    return await Promise.all(students.map(async (student) => {
      const userInformation = await this.getUserInformation(student.id);
      return { ...student, userInformation };
    }));
  }
  
  private async getUserInformation(userId: string) {
    return await this.userInformationRepository.createQueryBuilder("userInformation")
      .innerJoin("userInformation.user", "user", "user.id = :id", { id: userId })
      .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
      .getOne();
  }
  
  private filterStudentsNotInAcceptedTopics(students: any[], acceptedTopics: any[]) {
    return students.filter(student => {
      return !acceptedTopics.some(acceptedTopic => {
        return (acceptedTopic.requestedBy && acceptedTopic.requestedBy.id === student.id) ||
               (acceptedTopic.collaborator && acceptedTopic.collaborator.id === student.id) ||
               (acceptedTopic.acceptedBy && acceptedTopic.acceptedBy.id === student.id);
      });
    });
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

  async finishTopic(id: string) {
    try {
      const acceptedTopic: AcceptedTopic = await this.findOne(id);
  
      const finishedTopic = this.finishedTopicRepository.create({
        id: acceptedTopic.id,
        title: acceptedTopic.title,
        description: acceptedTopic.description,
        degreeProgram: acceptedTopic.degreeProgram,
        graduationOption: acceptedTopic.graduationOption,
        requestedBy: acceptedTopic.requestedBy,
        collaborator: acceptedTopic.collaborator,
        proposedByRole: acceptedTopic.proposedByRole,
        acceptedBy: acceptedTopic.acceptedBy,
        finishedAt: new Date(),
      });
  
      await this.finishedTopicRepository.save(finishedTopic);
      await this.remove(id);
  
      return {
        message: 'El tema se ha finalizado exitosamente'
      };
    } catch (error) {
      handleDBError(error);
    }
  }
}
