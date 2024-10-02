import { Body, Controller, Post, Query } from '@nestjs/common';
import { AbandonedTopicService } from './abandoned-topic.service';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { DegreeProgramDto } from '../accepted-topics/dto/degree-program.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

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
  
}
