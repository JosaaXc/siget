import { IsEmail } from "class-validator";

export class EmailToChangePasswordDto {
  @IsEmail()
  email: string;
}