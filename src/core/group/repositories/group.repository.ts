import { UpdateGroupDto } from "./../dto/update-group.dto";
import { Group } from "../entities/group.entity";
import { CreateGroupDto } from "./../dto/create-group.dto";
import { VoteResult } from "../../../shared/interfaces/vote-result";

export interface GroupRepository {
  create(createGroupDto: CreateGroupDto): Promise<Group>;
  findById(id: string): Promise<Group>;
  findManyByUser(user: string, page: number): Promise<Group[]>;
  findManyByGroup(group: string, page: number): Promise<Group[]>;
  findAllWithoutSubGroups(user: string): Promise<Group[]>;
  findAllWithoutParticipants(user: string): Promise<Group[]>;
  findAllWithParticipants(user: string): Promise<Group[]>;
  getResult(group: string): Promise<VoteResult>;
  update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group>;
  delete(id: string): Promise<Group>;
}
