import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { TopicDocumentCommentsService } from './topic-document-comments.service';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateTopicDocumentCommentDto, GetAllCommentsDto, UpdateTopicDocumentCommentDto } from './dto';


@Controller('topic-document-comments')
export class TopicDocumentCommentsController {
  constructor(private readonly topicDocumentCommentsService: TopicDocumentCommentsService) {}

  @Post()
  @Auth(ValidRoles.asesor)
  create(@Body() createTopicDocumentCommentDto: CreateTopicDocumentCommentDto) {
    return this.topicDocumentCommentsService.create(createTopicDocumentCommentDto);
  }

  @Get(':topicDocumentId')
  @Auth(ValidRoles.asesor, ValidRoles.student, ValidRoles.titular_materia)
  findAllCommentsByTopicDocument(
    @Param('topicDocumentId', ParseUUIDPipe ) topicDocumentId: string,
    @Query() paginationDto:PaginationDto,
  ) {
    return this.topicDocumentCommentsService.findAllCommentsByTopicDocument(topicDocumentId, paginationDto);
  }

  @Get(':id')
  @Auth(ValidRoles.asesor)
  findOne(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.topicDocumentCommentsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.asesor)
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateTopicDocumentCommentDto: UpdateTopicDocumentCommentDto
  ) {
    return this.topicDocumentCommentsService.update(id, updateTopicDocumentCommentDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.asesor)
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.topicDocumentCommentsService.remove(id);
  }
}
