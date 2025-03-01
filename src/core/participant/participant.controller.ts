import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { ParticipantService } from "./participant.service";
import { CreateParticipantDto } from "./dto/create-participant.dto";
import { UpdateParticipantDto } from "./dto/update-participant.dto";
import { Message } from "../../shared/interfaces/message";
import { Participant } from "./entities/participant.entity";
import { ParseObjectIdPipe } from "../../shared/pipes/parse-object-id.pipe";
import { AuthGuard } from "../../shared/modules/auth/guards/auth.guard";

@Controller("participant")
export class ParticipantController {
  public constructor(private readonly participantService: ParticipantService) {}

  @Post()
  @UseGuards(AuthGuard)
  public async create(
    @Body() createParticipantDto: CreateParticipantDto,
  ): Promise<Message> {
    return this.participantService.create(createParticipantDto);
  }

  @Get("findAllByGroup/:group")
  @UseGuards(AuthGuard)
  public async findAllByGroup(
    @Param("group", ParseObjectIdPipe) group: string,
  ): Promise<Participant[]> {
    return this.participantService.findAllByGroup(group);
  }

  @Get("findManyByGroup/:group/:page")
  @UseGuards(AuthGuard)
  public async findManyByGroup(
    @Param("group", ParseObjectIdPipe) group: string,
    @Param("page", ParseIntPipe) page: number,
  ): Promise<Participant[]> {
    return this.participantService.findManyByGroup(group, page < 0 ? 0 : page);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  public async update(
    @Param("id") id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ): Promise<Message> {
    return this.participantService.update(id, updateParticipantDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  public async delete(@Param("id") id: string): Promise<Message> {
    return this.participantService.delete(id);
  }
}
