import { Group } from "../../core/group/entities/group.entity";

export interface VoteResult {
  group: Group;
  participants: ParticipantResult[];
}

interface ParticipantResult {
  _id: string;
  name: string;
  votes: number;
}
