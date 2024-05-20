import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateTopicDocumentCommentDto {
    
    @IsString()
    @MinLength(10)
    @MaxLength(500)
    comment: string;
    
    @IsUUID()
    topicDocument: string; 
}
