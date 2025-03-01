import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../../../../core/user/user.service";
import { AuthenticatedRequest } from "../../../interfaces/authorized-request";

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    const token = request.headers.authorization;
    if (!token) throw new UnauthorizedException("Token não enviado");

    const user = await this.userService.decodeToken(token);

    if (!user.isEmailValid)
      throw new UnauthorizedException("Valide seu email e tente novamente");

    request.user = user;
    return true;
  }
}
