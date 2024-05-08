import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { TopicScheduleService } from './topic-schedule.service';
import { CreateTopicScheduleDto } from './dto/create-topic-schedule.dto';
import { UpdateTopicScheduleDto } from './dto/update-topic-schedule.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@Controller('topic-schedule')
export class TopicScheduleController {
  constructor(private readonly topicScheduleService: TopicScheduleService) {}

  @Post()
  @Auth()
  create(
    @Body() createTopicScheduleDto: CreateTopicScheduleDto,
    @GetUser() user: User
  ) {
    return this.topicScheduleService.create(createTopicScheduleDto, user);
  }

  @Get()
  findAll(
    @Query() paginationDto : PaginationDto
  ) {
    return this.topicScheduleService.findAll( paginationDto );
  }
  
  @Get('my-schedules')
  @Auth()
  findMySchedules(
    @Query() paginationDto : PaginationDto,
    @GetUser() user: User
  ) {
    return this.topicScheduleService.findMySchedules( paginationDto, user );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe ) id: string) {
    return this.topicScheduleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateTopicScheduleDto: UpdateTopicScheduleDto
  ) {
    return this.topicScheduleService.update(id, updateTopicScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.topicScheduleService.remove(id);
  }
}
