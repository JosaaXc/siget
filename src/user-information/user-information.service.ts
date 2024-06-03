import { Injectable } from '@nestjs/common';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { UpdateUserInformationDto } from './dto/update-user-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInformation } from './entities/user-information.entity';
import { Repository } from 'typeorm';
import { handleDBError } from 'src/common/errors/handleDBError.errors';

@Injectable()
export class UserInformationService {

  constructor(
    @InjectRepository(UserInformation)
    private userInformationRepository: Repository<UserInformation>,
  ) {}

  async create(createUserInformationDto: CreateUserInformationDto, userId: string) {
    try {
      
      return await this.userInformationRepository.save({
        ...createUserInformationDto,
        user: { id: userId }
      });

    } catch (error) {
      handleDBError(error)
    }
  }

  findAll() {
    return this.userInformationRepository.find();
  }

  async findOne(id: string) {
    try {
      
      return await this.userInformationRepository.findOneOrFail({
        where: { user: { id } }
      });

    } catch (error) {
      handleDBError(error)
    }
  }

  async findOneById(id: string) {
    return await this.findOne(id); 
  }

  async update(userId: string, updateUserInformationDto: UpdateUserInformationDto) {
    try {
      
      const userInformation = await this.findOne(userId);
      const updatedUserInformation = this.userInformationRepository.merge(userInformation, updateUserInformationDto);
      return await this.userInformationRepository.save(updatedUserInformation);

    } catch (error) {
      handleDBError(error)
    }
  }

}
