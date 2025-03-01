import { Participant } from "../entities/participant.entity";
import { CreateParticipantDto } from "./../dto/create-participant.dto";
import { UpdateParticipantDto } from "./../dto/update-participant.dto";

export interface ParticipantRepository {
  create(createParticipantDto: CreateParticipantDto): Promise<Participant>;
  findById(id: string): Promise<Participant>;
  findManyByGroup(group: string, page: number): Promise<Participant[]>;
  findAllByGroup(group: string): Promise<Participant[]>;
  update(
    id: string,
    updateParticipantDto: UpdateParticipantDto,
  ): Promise<Participant>;
  delete(id: string): Promise<Participant>;
}
