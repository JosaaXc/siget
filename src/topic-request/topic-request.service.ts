import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTopicRequestDto } from './dto/create-topic-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicRequest } from './entities/topic-request.entity';
import { Repository } from 'typeorm';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { User } from '../auth/entities/user.entity';
import { UserInformation } from '../user-information/entities/user-information.entity';
import { Topic } from '../topic/entities/topic.entity';
import { AcceptPetitionDto } from './dto/accept-petition.dto';
import { AcceptedTopic } from '../accepted-topics/entities/accepted-topic.entity';

@Injectable()
export class TopicRequestService {

  constructor(
    @InjectRepository(TopicRequest)
    private topicRequestRepository: Repository<TopicRequest>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
    @InjectRepository(UserInformation)
    private userInformationRepository: Repository<UserInformation>,
    @InjectRepository(AcceptedTopic)
    private acceptedTopicRepository: Repository<AcceptedTopic>,
  ) {}

  async create(createTopicRequestDto: CreateTopicRequestDto, user: User) {

    const { topic } = createTopicRequestDto;
    const topicRequest = this.topicRequestRepository.create({
      topic: { id: topic },
      requestedBy: { id: user.id }
    });
    
    try {
      const savedTopicRequest = await this.topicRequestRepository.save(topicRequest);

      const topicCreated = await this.topicRequestRepository
        .createQueryBuilder('topicRequest')
        .leftJoinAndSelect('topicRequest.topic', 'topic')
        .where('topicRequest.id = :id', { id: savedTopicRequest.id })
        .getOne();

      // const userInformation = await this.userInformationRepository.findOne({ where: { user: { id: user.id } } });
      //TODO: Send notification to asesor or student about the new topic request
      return { topicRequest: topicCreated };
      
    } catch (error) {
      handleDBError(error);
    }
  }

  async findMyRequests(user: User) {
    try {
      return await this.topicRequestRepository
        .createQueryBuilder('topicRequest')
        .leftJoinAndSelect('topicRequest.topic', 'topic')
        .where('topicRequest.requestedBy = :userId', { userId: user.id })
        .getMany();
    } catch (error) {
      handleDBError(error);
    }
  }

  async findMyPeticions(user: User) {
    try {
      const topicRequests = await this.topicRequestRepository
        .createQueryBuilder('topicRequest')
        .innerJoinAndSelect('topicRequest.topic', 'topic', 'topic.proposedBy = :userId', { userId: user.id })
        .innerJoinAndSelect('topicRequest.requestedBy', 'requestedBy')
        .getMany();

      const topicRequestsWithUserInfo = await Promise.all(topicRequests.map(async (topicRequest) => {
        const userInformation = await this.userInformationRepository.findOne({ where: { user: { id: topicRequest.requestedBy.id } } });
        delete topicRequest.requestedBy.email;
        delete topicRequest.requestedBy.roles;
        delete userInformation.id;
        delete userInformation.phoneNumber;
        delete userInformation.address;
        return { ...topicRequest, requestedBy: { ...topicRequest.requestedBy, userInformation } };
      }));

      if(topicRequestsWithUserInfo.length === 0)
        return { message: 'You don´t have any peticions yet'}
      return topicRequestsWithUserInfo;
    } catch (error) {
      handleDBError(error);
    }
  }

  async acceptMyPetitions(id: string, user: User) {

    try {
      
      const topic = await this.topicRequestRepository.findOneOrFail({ where: { id } });
      return await this.migrateTopicToAcceptedTopic(topic, user);

    } catch (error) {
      handleDBError(error);
    }

  }

  // this private funtion migrate the topic to accepted topic table and the user who accepted the request
  private async migrateTopicToAcceptedTopic(topicRequest: TopicRequest, user: User) {
    try {
      
      const topic = await this.topicRepository.findOneOrFail({ where: { id: topicRequest.topic.id } });
      const acceptedTopic = this.acceptedTopicRepository.create({
        title: topic.title,
        description: topic.description,
        degreeProgram: topic.degreeProgram,
        graduationOption: topic.graduationOption,
        proposedByRole: topic.proposedByRole,
        acceptedBy: user,
        requestedBy: topicRequest.requestedBy
      });

      await this.acceptedTopicRepository.save(acceptedTopic);
      await this.topicRepository.delete(topic.id);

      return acceptedTopic; 

    } catch (error) {
      handleDBError(error);
    }
  }

  async rejectAPetition(id: string) {
    await this.remove(id);
    return { message: 'Petition rejected successfully' };
  }

  async remove(id: string) {
    const topic = this.topicRequestRepository.delete(id);
    if ((await topic).affected === 0) 
      throw new BadRequestException('Topic request not found');
    return { message: 'Topic request deleted successfully' };
  }
      
}
