import { Injectable } from '@nestjs/common';
import { CreateGraduationOptionDto } from './dto/create-graduation-option.dto';
import { UpdateGraduationOptionDto } from './dto/update-graduation-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GraduationOption } from './entities/graduation-option.entity';
import { Repository } from 'typeorm';
import { handleDBError } from 'src/common/errors/handleDBError.errors';

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
    return `This action returns all graduationOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} graduationOption`;
  }

  update(id: number, updateGraduationOptionDto: UpdateGraduationOptionDto) {
    return `This action updates a #${id} graduationOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} graduationOption`;
  }
}
