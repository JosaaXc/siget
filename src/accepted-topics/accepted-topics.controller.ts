import { Controller, Get, Param, Delete, Query, ParseUUIDPipe, Post, Body } from '@nestjs/common';
import { AcceptedTopicsService } from './accepted-topics.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';
import { DegreeProgramDto } from './dto/degree-program.dto';

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


  // get all users with role student that have not been accepted
  @Post('students')
  @Auth()
  findStudents(
    @GetUser() user: User,
    @Query() paginationDto: PaginationDto,
    @Body() degreeProgramDto: DegreeProgramDto
  ) {
    return this.acceptedTopicsService.findStudents( user, paginationDto, degreeProgramDto );
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
