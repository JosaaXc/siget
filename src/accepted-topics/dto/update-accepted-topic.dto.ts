import { PartialType } from '@nestjs/mapped-types';
import { CreateAcceptedTopicDto } from './create-accepted-topic.dto';

export class UpdateAcceptedTopicDto extends PartialType(CreateAcceptedTopicDto) {}
