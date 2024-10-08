import { Controller, Get, Param, Delete, Query, ParseUUIDPipe, Post, Body, Patch } from '@nestjs/common';
import { AcceptedTopicsService } from './accepted-topics.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';
import { DegreeProgramDto } from './dto/degree-program.dto';
import { UpdateAcceptedTopicDto } from './dto/update-accepted-topic.dto';

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

  @Post('get-by-degree-program')
  @Auth(ValidRoles.titular_materia)
  create(
    @Body() degreeProgramDto: DegreeProgramDto
  ) {
    return this.acceptedTopicsService.findByDegreeProgram( degreeProgramDto );
  }

  @Post('get-finished-topics')
  @Auth()
  getFinishedTopics(
    @Body() degreeProgramDto: DegreeProgramDto
  ) {
    return this.acceptedTopicsService.getFinishedTopics( degreeProgramDto );
  }

  // get all users with role student that have not been accepted
  @Post('students')
  @Auth(ValidRoles.student)
  findStudents(
    @GetUser() user: User,
    @Query() paginationDto: PaginationDto,
    @Body() degreeProgramDto: DegreeProgramDto
  ) {
    return this.acceptedTopicsService.findStudents( user, paginationDto, degreeProgramDto );
  }

  @Get(':id')
  @Auth(ValidRoles.student, ValidRoles.asesor, ValidRoles.titular_materia)
  findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.acceptedTopicsService.findOne(id);
  }

  @Post('finish-topic/:id')
  @Auth(ValidRoles.student, ValidRoles.asesor)
  finishTopic(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.acceptedTopicsService.finishTopic(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.student)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAcceptedTopicDto: UpdateAcceptedTopicDto,
  ) {
    return this.acceptedTopicsService.update(id, updateAcceptedTopicDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.asesor)
  remove(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.acceptedTopicsService.remove(id);
  }

  @Delete('abandon/:id')
  @Auth(ValidRoles.student)
  abandonTopic(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.acceptedTopicsService.abandonTopic(user, id);
  }

}
