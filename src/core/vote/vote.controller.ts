import { Controller, Post, Body } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { Message } from "../../shared/interfaces/message";

@Controller("vote")
export class VoteController {
  public constructor(private readonly voteService: VoteService) {}

  @Post()
  public create(@Body() createVoteDto: CreateVoteDto): Promise<Message> {
    return this.voteService.create(createVoteDto);
  }
}
