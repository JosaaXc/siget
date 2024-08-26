import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTopicReviewerDto } from './create-topic-reviewer.dto';

export class UpdateTopicReviewerDto extends PartialType(OmitType(CreateTopicReviewerDto, ['topicId'])) {}
