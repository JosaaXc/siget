import { IsUUID } from "class-validator";
import { PaginationDto } from "../../common/dtos/pagination.dto"

export class UserIdPaginatedDto extends PaginationDto {

    @IsUUID()
    userId: string;
}