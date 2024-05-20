import { IsUUID } from "class-validator";


export class GetAllCommentsDto {
  
	@IsUUID()
  topicDocumentId: string;
	
}