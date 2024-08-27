import { IsArray, IsUUID } from "class-validator";

export class DegreeProgramDto {
    @IsArray()
    @IsUUID("4", { each: true })
    degree: string
}