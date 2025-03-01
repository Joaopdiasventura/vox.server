import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty({ message: "Digite um email válido" })
  @IsEmail({}, { message: "Digite um email válido" })
  public email: string;

  @IsNotEmpty({ message: "Digite uma senha válida" })
  @IsString({ message: "Digite uma senha válido" })
  public password: string;
}
