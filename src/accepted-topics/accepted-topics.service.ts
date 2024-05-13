import { Injectable } from '@nestjs/common';
import { CreateAcceptedTopicDto } from './dto/create-accepted-topic.dto';
import { UpdateAcceptedTopicDto } from './dto/update-accepted-topic.dto';

@Injectable()
export class AcceptedTopicsService {
  create(createAcceptedTopicDto: CreateAcceptedTopicDto) {
    return 'This action adds a new acceptedTopic';
  }

  findAll() {
    return `This action returns all acceptedTopics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} acceptedTopic`;
  }

  update(id: number, updateAcceptedTopicDto: UpdateAcceptedTopicDto) {
    return `This action updates a #${id} acceptedTopic`;
  }

  remove(id: number) {
    return `This action removes a #${id} acceptedTopic`;
  }
}
