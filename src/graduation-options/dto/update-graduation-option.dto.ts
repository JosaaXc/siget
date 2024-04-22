import { PartialType } from '@nestjs/mapped-types';
import { CreateGraduationOptionDto } from './create-graduation-option.dto';

export class UpdateGraduationOptionDto extends PartialType(CreateGraduationOptionDto) {}
