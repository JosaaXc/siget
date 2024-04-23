import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserInformationDto {
    
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(15)
    fatherLastName: string;

    @IsString()
    @MinLength(3)
    @MaxLength(15)
    motherLastName: string;

    @IsString()
    @MinLength(10)
    @MaxLength(10)
    phoneNumber: string;

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    address: string;

}
