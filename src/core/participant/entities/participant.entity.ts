import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Group } from "src/core/group/entities/group.entity";

@Schema({ versionKey: false })
export class Participant extends Document<string, Participant, Participant> {
  @Prop({ required: true })
  public name: string;

  @Prop({ required: true, type: String, ref: "Group" })
  public group: string | Group;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
