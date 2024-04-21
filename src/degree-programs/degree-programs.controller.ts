import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DegreeProgramsService } from './degree-programs.service';
import { CreateDegreeProgramDto } from './dto/create-degree-program.dto';
import { UpdateDegreeProgramDto } from './dto/update-degree-program.dto';
import { EnrollUsersDto } from './dto/enroll-user-to-degree.dto';

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

  @Get()
  findAll() {
    return this.degreeProgramsService.findAll();
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
