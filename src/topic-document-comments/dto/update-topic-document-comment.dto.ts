import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTopicDocumentCommentDto {
    
    @IsString()
    @MinLength(10)
    @MaxLength(500)
    comment: string;
}
