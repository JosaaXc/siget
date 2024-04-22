import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GraduationOptionsService } from './graduation-options.service';
import { CreateGraduationOptionDto } from './dto/create-graduation-option.dto';
import { UpdateGraduationOptionDto } from './dto/update-graduation-option.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

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
  findOne(@Param('id') id: string) {
    return this.graduationOptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGraduationOptionDto: UpdateGraduationOptionDto) {
    return this.graduationOptionsService.update(+id, updateGraduationOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.graduationOptionsService.remove(+id);
  }
}
