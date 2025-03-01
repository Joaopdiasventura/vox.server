import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateVoteDto {
  @IsNotEmpty({ message: "Escolha um participante válido" })
  @IsMongoId({ message: "Escolha um participante válido" })
  public participant: string;
}
