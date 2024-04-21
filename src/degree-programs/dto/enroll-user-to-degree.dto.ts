import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class EnrollUsersDto {
  @IsArray()
  @IsNotEmpty()
  @IsUUID(4, { each: true })
  usersId: string[];
}