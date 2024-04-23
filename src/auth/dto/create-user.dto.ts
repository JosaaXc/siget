import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ValidRoles } from "../interfaces";

export class CreateUserDto {
  
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(18)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
    @IsEnum(ValidRoles, { each: true })
    roles: string[];
}