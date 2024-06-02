import { IsEnum } from "class-validator";
import { ScheduleStatus } from "../interfaces/schedule-status.interface";

export class RequestStatusDto {
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}
