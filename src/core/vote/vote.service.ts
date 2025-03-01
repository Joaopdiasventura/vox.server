import { Inject, Injectable } from "@nestjs/common";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { Message } from "../../shared/interfaces/message";
import { VoteRepository } from "./repositories/vote.repository";
import { ParticipantService } from "../participant/participant.service";
import { Participant } from "../participant/entities/participant.entity";

@Injectable()
export class VoteService {
  public constructor(
    @Inject("VoteRepository") private readonly voteRepository: VoteRepository,
    private readonly participantService: ParticipantService,
  ) {}

  public async create(createVoteDto: CreateVoteDto): Promise<Message> {
    await this.findParticipant(createVoteDto.participant);
    await this.voteRepository.create(createVoteDto);
    return { message: "Voto registrado com sucesso" };
  }

  private async findParticipant(participant: string): Promise<Participant> {
    return await this.participantService.findById(participant);
  }
}
