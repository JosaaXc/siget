import { IsBoolean } from "class-validator";

export class AcceptPetitionDto {
  
    @IsBoolean()
    isAccepted: boolean;
}
