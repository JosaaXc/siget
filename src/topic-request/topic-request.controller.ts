import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TopicRequestService } from './topic-request.service';
import { CreateTopicRequestDto } from './dto/create-topic-request.dto';
import { UpdateTopicRequestDto } from './dto/update-topic-request.dto';

@Controller('topic-request')
export class TopicRequestController {
  constructor(private readonly topicRequestService: TopicRequestService) {}

  @Post()
  create(@Body() createTopicRequestDto: CreateTopicRequestDto) {
    return this.topicRequestService.create(createTopicRequestDto);
  }

  @Get()
  findAll() {
    return this.topicRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicRequestDto: UpdateTopicRequestDto) {
    return this.topicRequestService.update(+id, updateTopicRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicRequestService.remove(+id);
  }
}
