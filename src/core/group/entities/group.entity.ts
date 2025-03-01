import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "src/core/user/entities/user.entity";

@Schema({ versionKey: false })
export class Group extends Document<string, Group, Group> {
  @Prop({ required: true })
  public name: string;

  @Prop({ required: true, type: String, ref: "User" })
  public user: string | User;

  @Prop({ required: false, type: String, ref: "Group" })
  public group?: string | Group;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
