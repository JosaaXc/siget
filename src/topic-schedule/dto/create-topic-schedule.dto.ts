import { IsDate, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateTopicScheduleDto {


    @IsUUID()
    topic: string;

    @IsDate()
    startTime: Date;

    @IsString()
    @MinLength(1)
    @MaxLength(30)
    place: string;

}
