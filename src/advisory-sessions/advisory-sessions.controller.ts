import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, ParseBoolPipe } from '@nestjs/common';
import { AdvisorySessionsService } from './advisory-sessions.service';
import { CreateAdvisorySessionDto } from './dto/create-advisory-session.dto';
import { UpdateAdvisorySessionDto } from './dto/update-advisory-session.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('advisory-sessions')
export class AdvisorySessionsController {
  constructor(private readonly advisorySessionsService: AdvisorySessionsService) {}

  @Post()
  @Auth( ValidRoles.student, ValidRoles.asesor )
  create(@Body() createAdvisorySessionDto: CreateAdvisorySessionDto) {
    return this.advisorySessionsService.create(createAdvisorySessionDto);
  }

  @Get('accepted-topic/:id')
  @Auth( ValidRoles.student, ValidRoles.asesor, ValidRoles.titular_materia )
  findAllByAcceptedTopic(@Param('id', ParseUUIDPipe) id: string) {
    return this.advisorySessionsService.findAllByAcceptedTopic(id);
  }

  @Get('accepted-topic/signed/:id')
  @Auth( ValidRoles.student, ValidRoles.asesor, ValidRoles.titular_materia )
  findAllByAcceptedTopicAndIsSigned(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isSigned', ParseBoolPipe ) isSigned: boolean,
  ) {
    return this.advisorySessionsService.findAllByAcceptedTopicAndIsSigned(id, isSigned);
  }

  @Get(':id')
  @Auth( ValidRoles.student, ValidRoles.asesor, ValidRoles.titular_materia )
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.advisorySessionsService.findOne(id);
  }

  // sign up for an advisory session
  @Patch('sign-up/:id')
  @Auth( ValidRoles.asesor )
  signUp(@Param('id', ParseUUIDPipe) id: string) {
    return this.advisorySessionsService.signUp(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.asesor, ValidRoles.student )
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateAdvisorySessionDto: UpdateAdvisorySessionDto
  ) {
    return this.advisorySessionsService.update(id, updateAdvisorySessionDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.asesor, ValidRoles.student )
  remove(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.advisorySessionsService.remove(id);
  }
}
