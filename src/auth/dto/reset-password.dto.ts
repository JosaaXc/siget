import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {

    @IsString()
    @MinLength(6)
    @MaxLength(18)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}