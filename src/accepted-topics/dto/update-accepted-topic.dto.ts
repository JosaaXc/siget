import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateTopicDto } from "src/topic/dto/create-topic.dto";

export class UpdateAcceptedTopicDto extends PartialType(OmitType(CreateTopicDto, ['collaborator', 'degreeProgram'])) {}