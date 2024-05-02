import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('topic')
@Auth( ValidRoles.student, ValidRoles.asesor )
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  create(
    @Body() createTopicDto: CreateTopicDto,
    @GetUser() user: User
  ) {
    return this.topicService.create(createTopicDto, user);
  }

  @Get()
  findAll( 
    @Query() paginationDto: PaginationDto
  ) {
    return this.topicService.findAll( paginationDto );
  }

  @Get('/my-topics')
  findMyTopics(
    @GetUser() user: User
  ) {
    return this.topicService.findMyTopics(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.topicService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateTopicDto: UpdateTopicDto
  ) {
    return this.topicService.update(id, updateTopicDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.topicService.remove(id);
  }
}
