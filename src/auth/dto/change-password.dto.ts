import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
    
    @IsString()
    @MinLength(6)
    @MaxLength(18)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    oldPassword: string;

    @IsString()
    @MinLength(6)
    @MaxLength(18)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    newPassword: string;

}