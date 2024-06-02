import { IsArray, IsDateString, IsString , IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateScheduleDto {

    @IsString()
    @MinLength(3)
    @MaxLength(150)
    topic: string;

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    location: string;

    @IsDateString()
    date: string;

    @IsString()
    time: string;

    @IsArray()
    @IsUUID('4', { each: true })
    participants: string[];
    
    @IsUUID()
    invitee: string;

}
