import { Vote } from "../entities/vote.entity";
import { CreateVoteDto } from "./../dto/create-vote.dto";

export interface VoteRepository {
  create(createVoteDto: CreateVoteDto): Promise<Vote>;
}
