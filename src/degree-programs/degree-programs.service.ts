import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDegreeProgramDto } from './dto/create-degree-program.dto';
import { UpdateDegreeProgramDto } from './dto/update-degree-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DegreeProgram } from './entities/degree-program.entity';
import { Repository } from 'typeorm';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class DegreeProgramsService {

  constructor(
    @InjectRepository(DegreeProgram)
    private degreeProgramRepository: Repository<DegreeProgram>, 
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createDegreeProgramDto: CreateDegreeProgramDto) {
    
    try {
      const degreeProgram = this.degreeProgramRepository.create(createDegreeProgramDto);
      return await this.degreeProgramRepository.save(degreeProgram);
    } catch (error) {
      handleDBError(error);
    }

  }

  async enrollUsers(degreeProgramId: string, usersId: string[]) {
    try {
      await this.userRepository.createQueryBuilder()
        .relation(DegreeProgram, 'users')
        .of(degreeProgramId)
        .add(usersId);
      
        return { message: 'Users enrolled successfully', degreeProgramId, usersId };
    } catch (error) {
      handleDBError(error);
    }
  }

  async enrollDegreesToUser(userId: string, degreeProgramsId: string[]) {
    try {
      await this.userRepository.createQueryBuilder()
        .relation(User, 'degreePrograms')
        .of(userId)
        .add(degreeProgramsId);
  
      return { message: `Degree programs added on user` };

    } catch (error) {
      handleDBError(error);
    }
  }

  async unenrollDegreesToUser(userId: string, degreeProgramsId: string[]) {
    try {
      await this.userRepository.createQueryBuilder()
        .relation(User, 'degreePrograms')
        .of(userId)
        .remove(degreeProgramsId);
  
      return { message: `Degree programs removed on user` };

    } catch (error) {
      handleDBError(error);
    }
  }

  findAll( paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      return this.degreeProgramRepository.find({
        take: limit,
        skip: offset
      });
    } catch (error) {
      handleDBError(error);
    }
  }

  async findOne(id: string) {
    try{
      return await this.degreeProgramRepository.findOneOrFail({ where: { id } });
    }catch(error){
      handleDBError(error);
    }
  }

  async findUsersByDegreeProgram(degreeProgramId: string) {
    try {
      
      return await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.degreePrograms', 'degreePrograms')
        .where('degreePrograms.id = :degreeProgramId', { degreeProgramId })
        .select(['user.id', 'user.email', 'user.roles'])
        .getMany();

    } catch (error) {
      handleDBError(error);
    }
  }

  async update(id: string, updateDegreeProgramDto: UpdateDegreeProgramDto) {
    const degreeProgram = await this.findOne(id);
    
    try {
      const updatedDegreeProgram = this.degreeProgramRepository.merge(degreeProgram, updateDegreeProgramDto);
      return await this.degreeProgramRepository.save(updatedDegreeProgram);
    } catch (error) {
      handleDBError(error);
    }
  }

  async remove(id: string) {
    
    const degreeProgram = await this.degreeProgramRepository.delete(id);
    
    if ( degreeProgram.affected === 0 ) 
      throw new NotFoundException(`Degree Program with ID ${id} not found`)  
      
    return { message: `Degree Program with ID ${id} deleted` };
  }

  async unenrollUsers(degreeProgramId: string, usersId: string[]) {
    try {
      await this.userRepository.createQueryBuilder()
        .relation(DegreeProgram, 'users')
        .of(degreeProgramId)
        .remove(usersId);
  
      return { message: 'Users unenrolled successfully', degreeProgramId, usersId };
    } catch (error) {
      handleDBError(error);
    }
  }
  
}
