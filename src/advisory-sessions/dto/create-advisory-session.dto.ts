import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateAdvisorySessionDto {
    
    @IsString()
    @MinLength(1)
    @MaxLength(150)
    reviewedTopic: string;
    
    @IsString()
    @MinLength(1)
    @MaxLength(150)
    observations: string;
    
    @IsString()
    date: string;
    
    @IsUUID()
    acceptedTopic: string;

}
