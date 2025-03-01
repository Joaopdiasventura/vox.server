import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateParticipantDto } from "./dto/create-participant.dto";
import { UpdateParticipantDto } from "./dto/update-participant.dto";
import { ParticipantRepository } from "./repositories/participant.repository";
import { GroupService } from "../group/group.service";
import { Message } from "../../shared/interfaces/message";
import { Group } from "../group/entities/group.entity";
import { Participant } from "./entities/participant.entity";

@Injectable()
export class ParticipantService {
  public constructor(
    @Inject("ParticipantRepository")
    private readonly participantRepository: ParticipantRepository,
    private readonly groupService: GroupService,
  ) {}

  public async create(
    createParticipantDto: CreateParticipantDto,
  ): Promise<Message> {
    await this.findGroup(createParticipantDto.group);
    await this.participantRepository.create(createParticipantDto);
    return { message: "Participante registrado com sucesso" };
  }

  public async findById(id: string): Promise<Participant> {
    const participant = await this.participantRepository.findById(id);
    if (!participant)
      throw new NotFoundException("Participante não encontrado");
    return participant;
  }

  public async findAllByGroup(group: string): Promise<Participant[]> {
    return await this.participantRepository.findAllByGroup(group);
  }

  public async findManyByGroup(
    group: string,
    page: number,
  ): Promise<Participant[]> {
    return await this.participantRepository.findManyByGroup(group, page);
  }

  public async update(
    id: string,
    updateParticipantDto: UpdateParticipantDto,
  ): Promise<Message> {
    await this.findById(id);
    if (updateParticipantDto.group) delete updateParticipantDto.group;
    await this.participantRepository.update(id, updateParticipantDto);
    return { message: "Participante atualizado com sucesso" };
  }

  public async delete(id: string): Promise<Message> {
    await this.findById(id);
    await this.participantRepository.delete(id);
    return { message: "Participante removido com sucesso" };
  }

  private async findGroup(group: string): Promise<Group> {
    return await this.groupService.findById(group);
  }
}
