import { PartialType } from '@nestjs/mapped-types';
import { CreateTopicRequestDto } from './create-topic-request.dto';

export class UpdateTopicRequestDto extends PartialType(CreateTopicRequestDto) {}
