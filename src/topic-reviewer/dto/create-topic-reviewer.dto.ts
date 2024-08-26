import { IsUUID } from "class-validator";

export class CreateTopicReviewerDto {

    @IsUUID()
    topicId: string;

    @IsUUID()
    reviewerId: string;

}
