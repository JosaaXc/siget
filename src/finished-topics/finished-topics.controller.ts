import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { FinishedTopicsService } from './finished-topics.service';
import { Auth } from '../auth/decorators';
import { DegreeProgramDto } from '../accepted-topics/dto/degree-program.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('finished-topics')
@Auth()
export class FinishedTopicsController {
  constructor(private readonly finishedTopicsService: FinishedTopicsService) {}

  @Post('get-by-degree-program')
  create(
    @Body() degreeProgramDto: DegreeProgramDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.finishedTopicsService.findByDegreeProgram( degreeProgramDto, paginationDto );
  }

  @Post('get-all-by-degree-program')
  getAll(
    @Body() degreeProgramDto: DegreeProgramDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.finishedTopicsService.findByDegreeProgram( degreeProgramDto, paginationDto );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe ) id: string) {
    return this.finishedTopicsService.findOne(id);
  }

}
