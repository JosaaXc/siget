import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcceptedTopicsService } from './accepted-topics.service';
import { CreateAcceptedTopicDto } from './dto/create-accepted-topic.dto';
import { UpdateAcceptedTopicDto } from './dto/update-accepted-topic.dto';

@Controller('accepted-topics')
export class AcceptedTopicsController {
  constructor(private readonly acceptedTopicsService: AcceptedTopicsService) {}

  @Post()
  create(@Body() createAcceptedTopicDto: CreateAcceptedTopicDto) {
    return this.acceptedTopicsService.create(createAcceptedTopicDto);
  }

  @Get()
  findAll() {
    return this.acceptedTopicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acceptedTopicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcceptedTopicDto: UpdateAcceptedTopicDto) {
    return this.acceptedTopicsService.update(+id, updateAcceptedTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acceptedTopicsService.remove(+id);
  }
}
