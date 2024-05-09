import { Injectable } from '@nestjs/common';
import { CreateTopicRequestDto } from './dto/create-topic-request.dto';
import { UpdateTopicRequestDto } from './dto/update-topic-request.dto';

@Injectable()
export class TopicRequestService {
  create(createTopicRequestDto: CreateTopicRequestDto) {
    return 'This action adds a new topicRequest';
  }

  findAll() {
    return `This action returns all topicRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} topicRequest`;
  }

  update(id: number, updateTopicRequestDto: UpdateTopicRequestDto) {
    return `This action updates a #${id} topicRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} topicRequest`;
  }
}
