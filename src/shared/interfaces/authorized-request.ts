import { Request } from "express";
import { User } from "../../core/user/entities/user.entity";

export interface AuthenticatedRequest extends Request {
  user: User;
}
