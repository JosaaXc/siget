import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';

import { ScheduleService } from './schedule.service';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateScheduleDto, RequestStatusDto, UpdateScheduleDto } from './dto';

@Controller('schedule')
@Auth()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(
    @Body() createScheduleDto: CreateScheduleDto, 
    @GetUser() user: User
  ) {
    return this.scheduleService.create(createScheduleDto, user);
  }

  @Get('my-request')
  findMyRequest(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.scheduleService.findMyRequest(user, paginationDto);
  }

  @Get('my-petition')
  findMyPetition(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.scheduleService.findMyPetition(user, paginationDto);
  }

  @Get('my-request-by-status')
  findMyRequestByStatus(
    @Query() paginationDto: PaginationDto,
    @Body() ScheduleStatusDto: RequestStatusDto,
    @GetUser() user: User
  ) {
    return this.scheduleService.findMyRequestByStatus(user, paginationDto, ScheduleStatusDto);
  }

  @Get('my-petition-by-status')
  findMyPetitionByStatus(
    @Query() paginationDto: PaginationDto,
    @Body() ScheduleStatusDto: RequestStatusDto,
    @GetUser() user: User
  ) {
    return this.scheduleService.findMyPetitionByStatus(user, paginationDto, ScheduleStatusDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe ) id: string) {
    return this.scheduleService.findOne(id);
  }

  @Patch(':id/accept')
  accept(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() ScheduleStatusDto: RequestStatusDto,
    @GetUser() user: User
  ) {
    return this.scheduleService.acceptSchedule(id, ScheduleStatusDto, user);
  }

  @Delete(':id/reject')
  reject(
    @Param('id', ParseUUIDPipe ) id: string,
    @GetUser() user: User
  ) {
    return this.scheduleService.rejectSchedule(id, user);
  }
}
