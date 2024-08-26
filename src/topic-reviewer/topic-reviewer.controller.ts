import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TopicReviewerService } from './topic-reviewer.service';
import { CreateTopicReviewerDto } from './dto/create-topic-reviewer.dto';
import { UpdateTopicReviewerDto } from './dto/update-topic-reviewer.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('topic-reviewer')
export class TopicReviewerController {
  constructor(private readonly topicReviewerService: TopicReviewerService) {}

  @Post()
  @Auth(ValidRoles.titular_materia)
  create(@Body() createTopicReviewerDto: CreateTopicReviewerDto) {
    return this.topicReviewerService.create(createTopicReviewerDto);
  }

  @Get()
  @Auth()
  findAll( paginationDto: PaginationDto) {
    return this.topicReviewerService.findAll( paginationDto );
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe ) id: string) {
    return this.topicReviewerService.findOne(id);
  }
  
  @Get('by-topic/:topicId')
  @Auth()
  findByTopic(@Param('topicId', ParseUUIDPipe ) topicId: string) {
    return this.topicReviewerService.findByTopic(topicId);
  }

  @Get('by-reviewer/:reviewerId')
  @Auth()
  findByReviewer(@Param('reviewerId', ParseUUIDPipe ) reviewerId: string) {
    return this.topicReviewerService.findByReviewer(reviewerId);
  }

  @Patch(':id')
  @Auth(ValidRoles.titular_materia)
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateTopicReviewerDto: UpdateTopicReviewerDto
  ) {
    return this.topicReviewerService.update(id, updateTopicReviewerDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.titular_materia)
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.topicReviewerService.remove(id);
  }
}
