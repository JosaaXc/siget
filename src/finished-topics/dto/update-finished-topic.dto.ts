import { PartialType } from '@nestjs/mapped-types';
import { CreateFinishedTopicDto } from './create-finished-topic.dto';

export class UpdateFinishedTopicDto extends PartialType(CreateFinishedTopicDto) {}
