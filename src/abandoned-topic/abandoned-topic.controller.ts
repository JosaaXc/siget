import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { AbandonedTopicService } from './abandoned-topic.service';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { DegreeProgramDto } from '../accepted-topics/dto/degree-program.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';

@Controller('abandoned-topic')
export class AbandonedTopicController {
  constructor(private readonly abandonedTopicService: AbandonedTopicService) {}


  @Post('get-by-degree-program')
  @Auth(ValidRoles.student)
  create(
    @Query() paginationDto: PaginationDto,
    @Body() degreeProgramDto: DegreeProgramDto
  ) {
    return this.abandonedTopicService.findByDegreeProgram( degreeProgramDto, paginationDto );
  }

  @Get('get-by-assessor')
  @Auth(ValidRoles.asesor)
  getByAssessor(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.abandonedTopicService.findByAssessor(paginationDto, user);
  }

  @Delete()
  @Auth(ValidRoles.asesor)
  delete(@Query('id') id: string) {
    return this.abandonedTopicService.delete(id);
  }

}
