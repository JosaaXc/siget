import { ValidRoles } from "../interfaces";
import { IsArray, IsEnum, IsUUID } from "class-validator";

export class UserWithRoleAndDegreeDto {

    @IsEnum(ValidRoles)
    role: ValidRoles;

    @IsArray()
    @IsUUID("4", { each: true })
    degree: string[];

}