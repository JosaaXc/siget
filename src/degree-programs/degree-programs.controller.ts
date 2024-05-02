import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { DegreeProgramsService } from './degree-programs.service';
import { CreateDegreeProgramDto, EnrollDegreesToUserDto, EnrollUsersDto, UpdateDegreeProgramDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('degree-programs')
export class DegreeProgramsController {

  constructor(
    private readonly degreeProgramsService: DegreeProgramsService
  ) {}

  @Post()
  create(@Body() createDegreeProgramDto: CreateDegreeProgramDto) {
    return this.degreeProgramsService.create(createDegreeProgramDto);
  }

  @Post(':degreeProgramsId/enroll-users')
  async enrollUsers(
    @Param('degreeProgramsId', ParseUUIDPipe ) degreeProgramsId: string, 
    @Body() enrollUsersDto: EnrollUsersDto
  ) {
    return this.degreeProgramsService.enrollUsers(degreeProgramsId, enrollUsersDto.usersId);
  }

  @Post(':userId/enroll-degree-programs')
  async enrollDegreesToUser(
    @Param('userId', ParseUUIDPipe ) userId: string, 
    @Body() enrollDegreesToUserDto: EnrollDegreesToUserDto
  ) {
    return this.degreeProgramsService.enrollDegreesToUser(userId, enrollDegreesToUserDto.degreeProgramsId);
  }

  @Delete(':userId/unenroll-degree-programs')
  async unenrollDegreesToUser(
    @Param('userId', ParseUUIDPipe ) userId: string, 
    @Body() enrollDegreesToUserDto: EnrollDegreesToUserDto
  ) {
    return this.degreeProgramsService.unenrollDegreesToUser(userId, enrollDegreesToUserDto.degreeProgramsId);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto 
    ) {
    return this.degreeProgramsService.findAll( paginationDto );
  }

  @Get(':degreeProgramId/users')
  async findUsersByDegreeProgram(
    @Param('degreeProgramId', ParseUUIDPipe ) degreeProgramId: string
  ) {
    return this.degreeProgramsService.findUsersByDegreeProgram(degreeProgramId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.degreeProgramsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDegreeProgramDto: UpdateDegreeProgramDto
  ) {
    return this.degreeProgramsService.update(id, updateDegreeProgramDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.degreeProgramsService.remove(id);
  }

  @Delete(':degreeProgramId/unenroll-users')
  async removeUsers(
    @Param('degreeProgramId', ParseUUIDPipe ) degreeProgramId: string, 
    @Body() enrollUsersDto: EnrollUsersDto
  ) {
    return this.degreeProgramsService.unenrollUsers(degreeProgramId, enrollUsersDto.usersId);
  }
}
