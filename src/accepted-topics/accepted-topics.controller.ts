import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { AcceptedTopicsService } from './accepted-topics.service';
import { UpdateAcceptedTopicDto } from './dto/update-accepted-topic.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';

@Controller('accepted-topics')
export class AcceptedTopicsController {
  constructor(private readonly acceptedTopicsService: AcceptedTopicsService) {}

  @Get()
  @Auth(ValidRoles.student, ValidRoles.asesor)
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.acceptedTopicsService.findAll( paginationDto, user ); 
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.acceptedTopicsService.findOne(id);
  }

  @Delete(':id')
  @Auth(ValidRoles.asesor)
  remove(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.acceptedTopicsService.remove(id);
  }

}
