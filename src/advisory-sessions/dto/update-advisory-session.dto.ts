import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateAdvisorySessionDto{
    
    @IsString()
    @MinLength(1)
    @MaxLength(150)
    reviewedTopic: string;
    
    @IsString()
    @MinLength(1)
    @MaxLength(150)
    observations: string;

}
