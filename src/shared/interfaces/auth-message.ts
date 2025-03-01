import { User } from "../../core/user/entities/user.entity";
import { Message } from "./message";

export interface AuthMessage extends Message {
  user: User;
  token: string;
}
