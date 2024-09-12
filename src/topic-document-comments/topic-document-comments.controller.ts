import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { TopicDocumentCommentsService } from './topic-document-comments.service';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateTopicDocumentCommentDto, GetAllCommentsDto, UpdateTopicDocumentCommentDto, UserIdPaginatedDto } from './dto';
import { User } from '../auth/entities/user.entity';


@Controller('topic-document-comments')
export class TopicDocumentCommentsController {
  constructor(private readonly topicDocumentCommentsService: TopicDocumentCommentsService) {}

  @Post()
  @Auth(ValidRoles.asesor, ValidRoles.revisor)
  create(
    @Body() createTopicDocumentCommentDto: CreateTopicDocumentCommentDto,
    @GetUser() user: User
  ) {
    return this.topicDocumentCommentsService.create(createTopicDocumentCommentDto, user);
  }

  @Get('comments/:topicDocumentId')
  @Auth(ValidRoles.asesor, ValidRoles.student, ValidRoles.titular_materia)
  findAllCommentsByTopicDocument(
    @Param('topicDocumentId', ParseUUIDPipe ) topicDocumentId: string,
    @Query() paginationDto:PaginationDto,
  ) {
    return this.topicDocumentCommentsService.findAllCommentsByTopicDocument(topicDocumentId, paginationDto);
  }

  @Get('users-that-commented/:topicDocumentId')
  @Auth( ValidRoles.asesor, ValidRoles.student, ValidRoles.titular_materia )
  findAllUsersThatCommented(
    @Param('topicDocumentId', ParseUUIDPipe ) topicDocumentId: string,
  ) {
    return this.topicDocumentCommentsService.findAllUsersThatCommented(topicDocumentId);
  }

  @Get('comments-by-user/:topicDocumentId')
  @Auth(ValidRoles.asesor, ValidRoles.student, ValidRoles.titular_materia)
  findAllCommentsByUser(
    @Param('topicDocumentId', ParseUUIDPipe ) topicDocumentId: string,
    @Query() userIdPaginatedDto: UserIdPaginatedDto,
  ) {
    return this.topicDocumentCommentsService.findAllCommentsByUser(topicDocumentId, userIdPaginatedDto);
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
