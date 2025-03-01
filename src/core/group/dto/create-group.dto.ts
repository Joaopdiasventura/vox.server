import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGroupDto {
  @IsNotEmpty({ message: "Digite um nome válido" })
  @IsString({ message: "Digite um nome válido" })
  public name: string;

  @IsNotEmpty({ message: "Seu usuário não é válido" })
  @IsMongoId({ message: "Seu usuário não é válido" })
  public user: string;

  @IsOptional()
  @IsMongoId({ message: "Escolha um grupo válido" })
  public group?: string;
}
