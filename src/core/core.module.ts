import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { GroupModule } from "./group/group.module";
import { ParticipantModule } from "./participant/participant.module";
import { VoteModule } from "./vote/vote.module";
import { CoreGateway } from "./core.gateway";

@Module({
  imports: [UserModule, GroupModule, ParticipantModule, VoteModule],
  providers: [CoreGateway],
})
export class CoreModule {}
