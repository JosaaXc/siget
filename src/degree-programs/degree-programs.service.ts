import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDegreeProgramDto } from './dto/create-degree-program.dto';
import { UpdateDegreeProgramDto } from './dto/update-degree-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DegreeProgram } from './entities/degree-program.entity';
import { Repository } from 'typeorm';
import { handleDBError } from 'src/common/errors/handleDBError.errors';
import { User } from 'src/auth/entities/user.entity';

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

  findAll() {
    return this.degreeProgramRepository.find();
  }

  async findOne(id: string) {
    try{
      return await this.degreeProgramRepository.findOneOrFail({ where: { id } });
    }catch(error){
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
