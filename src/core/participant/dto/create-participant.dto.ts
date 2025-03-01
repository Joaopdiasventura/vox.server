import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateParticipantDto {
  @IsNotEmpty({ message: "Digite um nome válido" })
  @IsString({ message: "Digite um nome válido" })
  public name: string;

  @IsNotEmpty({ message: "Seu usuário não é valido" })
  @IsMongoId({ message: "Seu usuário não é valido" })
  public group: string;
}
