import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Digite um email válido" })
  @IsEmail({}, { message: "Digite um email válido" })
  public email: string;

  @IsNotEmpty({ message: "Digite um nome válido" })
  @IsString({ message: "Digite um nome válido" })
  public name: string;

  @IsNotEmpty({ message: "Digite uma senha válida" })
  @IsString({ message: "Digite uma senha válido" })
  public password: string;
}
