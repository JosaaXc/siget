import { IsDate, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTopicScheduleDto {
    
    @IsDate()
    startTime: Date;

    @IsString()
    @MinLength(1)
    @MaxLength(30)
    place: string;

}
