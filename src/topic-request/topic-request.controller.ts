import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TopicRequestService } from './topic-request.service';
import { CreateTopicRequestDto } from './dto/create-topic-request.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@Controller('topic-request')
@Auth()
export class TopicRequestController {
  constructor(private readonly topicRequestService: TopicRequestService) {}

  @Post()
  create(
    @Body() createTopicRequestDto: CreateTopicRequestDto,
    @GetUser() user: User
  ) {
    return this.topicRequestService.create(createTopicRequestDto, user);
  }

  @Get('my-peticions')
  findMyPeticions(
    @GetUser() user: User
  ) {
    return this.topicRequestService.findMyPeticions(user);
  }

  @Get('my-requests')
  findMyRequests(
    @GetUser() user: User
  ) {
    return this.topicRequestService.findMyRequests(user);
  }


  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.topicRequestService.remove(id);
  }
}
