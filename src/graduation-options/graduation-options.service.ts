import { Injectable } from '@nestjs/common';
import { CreateGraduationOptionDto } from './dto/create-graduation-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GraduationOption } from './entities/graduation-option.entity';
import { Repository } from 'typeorm';
import { handleDBError } from '../common/errors/handleDBError.errors';

@Injectable()
export class GraduationOptionsService {

  constructor(
    @InjectRepository(GraduationOption)
    private graduationOptionRepository: Repository<GraduationOption>
  ) {}

  async create(createGraduationOptionDto: CreateGraduationOptionDto) {
    try {
      return await this.graduationOptionRepository.save(createGraduationOptionDto);
    } catch (error) {
      handleDBError(error);
    }
  }

  findAll() {
    return this.graduationOptionRepository.find();
  }

  async findOne(id: string) {
    try {
      return await this.graduationOptionRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      handleDBError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.graduationOptionRepository.delete(id);
      return { mesage: 'Graduation option deleted' };
    } catch (error) {
      handleDBError(error)
    }
  }
}
