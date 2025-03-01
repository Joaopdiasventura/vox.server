import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { AuthMessage } from "../../shared/interfaces/auth-message";
import { ParseObjectIdPipe } from "../../shared/pipes/parse-object-id.pipe";
import { Message } from "../../shared/interfaces/message";
import { AuthGuard } from "../../shared/modules/auth/guards/auth.guard";

@Controller("user")
export class UserController {
  public constructor(public readonly userService: UserService) {}

  @Post()
  public create(@Body() createUserDto: CreateUserDto): Promise<AuthMessage> {
    return this.userService.create(createUserDto);
  }

  @Post("login")
  public login(@Body() loginUserDto: LoginUserDto): Promise<AuthMessage> {
    return this.userService.login(loginUserDto);
  }

  @Get("decodeToken/:token")
  public decodeToken(@Param("token") token: string): Promise<User> {
    return this.userService.decodeToken(token);
  }

  @Get("validateEmail/:token")
  public validateEmail(@Param("token") token: string): Promise<string> {
    return this.userService.validateEmail(token);
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  public update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Message> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  public delete(@Param("id", ParseObjectIdPipe) id: string): Promise<Message> {
    return this.userService.delete(id);
  }
}
