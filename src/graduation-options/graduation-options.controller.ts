import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { GraduationOptionsService } from './graduation-options.service';
import { CreateGraduationOptionDto } from './dto/create-graduation-option.dto';

@Controller('graduation-options')
//TODO: Add Auth decorator to the controller
export class GraduationOptionsController {
  constructor(private readonly graduationOptionsService: GraduationOptionsService) {}

  @Post()
  create(
    @Body() createGraduationOptionDto: CreateGraduationOptionDto
    //TODO: Add GetUser decorator to the create method
  ) {
    return this.graduationOptionsService.create(createGraduationOptionDto);
  }

  @Get()
  findAll() {
    return this.graduationOptionsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.graduationOptionsService.findOne(id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.graduationOptionsService.remove(id);
  }
}
