import { Module } from "@nestjs/common";
import { GroupService } from "./group.service";
import { GroupController } from "./group.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { GroupSchema } from "./entities/group.entity";
import { MongoGroupRepository } from "./repositories/group.mongo.repository";
import { CommonModule } from "../../shared/modules/common/common.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Group", schema: GroupSchema }]),
    CommonModule,
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    { provide: "GroupRepository", useClass: MongoGroupRepository },
  ],
  exports: [GroupService],
})
export class GroupModule {}
