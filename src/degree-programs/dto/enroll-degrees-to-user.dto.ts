import { IsArray, IsNotEmpty, IsUUID } from "class-validator";

export class EnrollDegreesToUserDto {
  @IsArray()
  @IsNotEmpty()
  @IsUUID(4, { each: true })
  degreeProgramsId: string[];
}