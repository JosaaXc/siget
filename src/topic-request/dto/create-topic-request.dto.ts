import { IsUUID } from "class-validator";

export class CreateTopicRequestDto {

    @IsUUID()
    topic: string; 
    
}
