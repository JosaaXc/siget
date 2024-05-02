import { IsNotEmpty, IsOptional, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateTopicDto {

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    title: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    description: string;

    @IsUUID()
    degreeProgram: string;

    @IsUUID()
    graduationOption: string;

    @IsUUID()
    @IsOptional()
    collaborator: string;

}
