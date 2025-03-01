import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { GroupRepository } from "./repositories/group.repository";
import { UserService } from "./../user/user.service";
import { Group } from "./entities/group.entity";
import { User } from "../user/entities/user.entity";
import { Message } from "../../shared/interfaces/message";
import { VoteResult } from "../../shared/interfaces/vote-result";

@Injectable()
export class GroupService {
  public constructor(
    @Inject("GroupRepository")
    private readonly groupRepository: GroupRepository,
    private readonly userService: UserService,
  ) {}

  public async create(createGroupDto: CreateGroupDto): Promise<Message> {
    await this.findUser(createGroupDto.user);
    if (createGroupDto.group) await this.findById(createGroupDto.group);

    await this.groupRepository.create(createGroupDto);
    return { message: "Grupo criado com sucesso" };
  }

  public async findById(id: string): Promise<Group> {
    const group = await this.groupRepository.findById(id);
    if (!group) throw new NotFoundException("Grupo não encontrado");
    return group;
  }

  public async findManyByUser(user: string, page: number): Promise<Group[]> {
    await this.findUser(user);
    return await this.groupRepository.findManyByUser(user, page);
  }

  public async findManyByGroup(group: string, page: number): Promise<Group[]> {
    await this.findById(group);
    return await this.groupRepository.findManyByGroup(group, page);
  }

  public async findAllWithoutSubGroups(user: string): Promise<Group[]> {
    return this.groupRepository.findAllWithoutSubGroups(user);
  }

  public async findAllWithoutParticipants(user: string): Promise<Group[]> {
    return this.groupRepository.findAllWithoutParticipants(user);
  }

  public async findAllWithParticipants(user: string): Promise<Group[]> {
    return this.groupRepository.findAllWithParticipants(user);
  }

  public async getResult(group: string): Promise<VoteResult> {
    return await this.groupRepository.getResult(group);
  }

  public async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Message> {
    const { group } = await this.findById(id);

    if (updateGroupDto.user) delete updateGroupDto.user;

    if (updateGroupDto.group && group && updateGroupDto.group != group)
      await this.findById(updateGroupDto.group);

    await this.groupRepository.update(id, updateGroupDto);
    return { message: "Grupo atualizado com sucesso" };
  }

  public async delete(id: string): Promise<Message> {
    await this.findById(id);
    await this.groupRepository.delete(id);
    return { message: "Grupo deletado com sucesso" };
  }

  private async findUser(user: string): Promise<User> {
    return await this.userService.findById(user);
  }
}
