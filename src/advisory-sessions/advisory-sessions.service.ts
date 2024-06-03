import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdvisorySessionDto } from './dto/create-advisory-session.dto';
import { UpdateAdvisorySessionDto } from './dto/update-advisory-session.dto';
import { AdvisorySession } from './entities/advisory-session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBError } from 'src/common/errors/handleDBError.errors';

@Injectable()
export class AdvisorySessionsService {

  constructor(
    @InjectRepository(AdvisorySession)
    private advisorySessionRepository: Repository<AdvisorySession>,
  ) {}

  async create(createAdvisorySessionDto: CreateAdvisorySessionDto) {
    try {
      const { acceptedTopic, ...createAdvisorySession } = createAdvisorySessionDto;
      const advisorySession = this.advisorySessionRepository.create({
        ...createAdvisorySession,
        acceptedTopic: { id: acceptedTopic },
      });
      await this.advisorySessionRepository.save(advisorySession);
      return advisorySession;

    } catch (error) {
      handleDBError(error);
    }
  }

  async findAllByAcceptedTopic(acceptedTopicId: string) {
    try {
      return await this.advisorySessionRepository.find({where: {acceptedTopic: {id: acceptedTopicId}}});
    } catch (error) {
      handleDBError(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.advisorySessionRepository.findOneOrFail({where: {id}});
    } catch (error) {
      handleDBError(error);
    }
  }

  async signUp(id: string) {
    try {
      const advisorySession = await this.advisorySessionRepository.findOneOrFail({where: {id}});
      advisorySession.isSigned = true;
      await this.advisorySessionRepository.save(advisorySession);
      return advisorySession;
    } catch (error) {
      handleDBError(error);
    }
  }

  async findAllByAcceptedTopicAndIsSigned(acceptedTopicId: string, isSigned: boolean) {
    try {
      return await this.advisorySessionRepository.find({where: {acceptedTopic: {id: acceptedTopicId}, isSigned}});
    } catch (error) {
      handleDBError(error);
    }
  }

  async update(id: string, updateAdvisorySessionDto: UpdateAdvisorySessionDto) {
    try {
      
      const advisorySession = await this.advisorySessionRepository.findOneOrFail({where: {id}});
      const { reviewedTopic, observations } = updateAdvisorySessionDto;
      advisorySession.reviewedTopic = reviewedTopic;
      advisorySession.observations = observations;
      await this.advisorySessionRepository.save(advisorySession);
      return advisorySession;

    } catch (error) {
      handleDBError(error);
    }
  }

  async remove(id: string) {
    const advisorySession = await this.advisorySessionRepository.delete({id});
    if(advisorySession.affected === 0) 
      throw new BadRequestException('Advisory session not found');

    return { message: 'Advisory session removed' };
  }
}
