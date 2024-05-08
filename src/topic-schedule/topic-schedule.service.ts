import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTopicScheduleDto } from './dto/create-topic-schedule.dto';
import { UpdateTopicScheduleDto } from './dto/update-topic-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicSchedule } from './entities/topic-schedule.entity';
import { Repository } from 'typeorm';
import { Topic } from '../topic/entities/topic.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TopicScheduleService {

  constructor(
    @InjectRepository(TopicSchedule)
    private topicScheduleRepository: Repository<TopicSchedule>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  async create(createTopicScheduleDto: CreateTopicScheduleDto, user: User) {
    try {
      
      const { topic, ...topicSchedule} = createTopicScheduleDto;

      const topicToCreate = this.topicScheduleRepository.create({
        ...topicSchedule,
        bookedBy: user,
        topic: { id: topic }
      });

      return await this.topicScheduleRepository.save(topicToCreate);
            
    } catch (error) {
      handleDBError(error);
    }
  }

  async findAll( paginationDto:PaginationDto ) {
    try {
      
      const { limit = 10, offset = 0 } = paginationDto;
  
      return await this.topicScheduleRepository.createQueryBuilder('topicSchedule')
        .leftJoinAndSelect('topicSchedule.topic', 'topic')
        .select(['topicSchedule.id', 'topicSchedule.startTime', 'topicSchedule.place', 'topic.id'])
        .take(limit)
        .skip(offset)
        .getMany();
      
    } catch (error) {
      handleDBError(error);
    }
  }

  async findMySchedules( paginationDto:PaginationDto, user: User ) {
    try {
      
      const { limit = 10, offset = 0 } = paginationDto;
  
      return await this.topicScheduleRepository.createQueryBuilder('topicSchedule')
        .leftJoinAndSelect('topicSchedule.topic', 'topic')
        .select(['topicSchedule.id', 'topicSchedule.startTime', 'topicSchedule.place', 'topic.id'])
        .where('topicSchedule.bookedBy = :id', { id: user.id })
        .take(limit)
        .skip(offset)
        .getMany();
      
    } catch (error) {
      handleDBError(error);
    }
  }

  async findOne(id: string ) {
    try {
      
      return await this.topicScheduleRepository.createQueryBuilder('topicSchedule')
        .leftJoinAndSelect('topicSchedule.topic', 'topic')
        .select(['topicSchedule.id', 'topicSchedule.startTime', 'topicSchedule.place', 'topic.id'])
        .where('topicSchedule.id = :id', { id })
        .getOne();

    } catch (error) {
      handleDBError(error);
    }
  }

  async update(id: string, updateTopicScheduleDto: UpdateTopicScheduleDto) {
    try {

      const topicToUpdate = this.topicScheduleRepository.create(updateTopicScheduleDto);

      await this.topicScheduleRepository.update(id, topicToUpdate);

      return await this.findOne(id);

    } catch (error) {
      handleDBError(error);
    }
  }

  async remove(id: string) {
    const topicRemoved = await this.topicScheduleRepository.delete(id);
    if(topicRemoved.affected === 0) throw new BadRequestException('Topic Schedule not found');
    return { message: 'Topic Schedule removed' }
  }
}
