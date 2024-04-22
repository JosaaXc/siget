import { IsEnum } from "class-validator";
import { GraduationOptionType } from "../interfaces/graduation-options.interfaces";

export class CreateGraduationOptionDto {
    @IsEnum(GraduationOptionType)
    name: string;
}
