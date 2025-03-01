import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { Group } from "./entities/group.entity";
import { GroupService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { ParseObjectIdPipe } from "../../shared/pipes/parse-object-id.pipe";
import { Message } from "../../shared/interfaces/message";
import { AuthGuard } from "../../shared/modules/auth/guards/auth.guard";
import { VoteResult } from "../../shared/interfaces/vote-result";

@Controller("group")
export class GroupController {
  public constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard)
  public create(@Body() createGroupDto: CreateGroupDto): Promise<Message> {
    return this.groupService.create(createGroupDto);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  public findById(@Param("id", ParseObjectIdPipe) id: string): Promise<Group> {
    return this.groupService.findById(id);
  }

  @Get("findManyByUser/:user/:page")
  @UseGuards(AuthGuard)
  public findManyByUser(
    @Param("user", ParseObjectIdPipe) user: string,
    @Param("page", ParseIntPipe) page: number,
  ): Promise<Group[]> {
    return this.groupService.findManyByUser(user, page < 0 ? 0 : page);
  }

  @Get("findManyByGroup/:group/:page")
  @UseGuards(AuthGuard)
  public findManyByGroup(
    @Param("group", ParseObjectIdPipe) group: string,
    @Param("page", ParseIntPipe) page: number,
  ): Promise<Group[]> {
    return this.groupService.findManyByGroup(group, page < 0 ? 0 : page);
  }

  @Get("findAllWithoutSubGroups/:user")
  @UseGuards(AuthGuard)
  public findAllWithoutSubGroups(
    @Param("user", ParseObjectIdPipe) user: string,
  ): Promise<Group[]> {
    return this.groupService.findAllWithoutSubGroups(user);
  }

  @Get("findAllWithoutParticipants/:user")
  @UseGuards(AuthGuard)
  public findAllWithoutParticipants(
    @Param("user", ParseObjectIdPipe) user: string,
  ): Promise<Group[]> {
    return this.groupService.findAllWithoutParticipants(user);
  }

  @Get("findAllWithParticipants/:user")
  @UseGuards(AuthGuard)
  public findAllWithParticipants(
    @Param("user", ParseObjectIdPipe) user: string,
  ): Promise<Group[]> {
    return this.groupService.findAllWithParticipants(user);
  }

  @Get("getResult/:group")
  @UseGuards(AuthGuard)
  public getResult(
    @Param("group", ParseObjectIdPipe) group: string,
  ): Promise<VoteResult> {
    return this.groupService.getResult(group);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  public update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<Message> {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  public delete(@Param("id", ParseObjectIdPipe) id: string): Promise<Message> {
    return this.groupService.delete(id);
  }
}
