import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { AuthMessage } from "../../../shared/interfaces/auth-message";
import { Message } from "../../../shared/interfaces/message";
import { User } from "../entities/user.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UtilsService } from "../../../shared/utils/utils.service";

const mockToken = "mockToken";

const mockUser = {
  id: "123",
  _id: "123",
  email: "test@example.com",
  name: "test",
  password: "hashedPassword",
  isEmailValid: false,
  toObject: jest.fn().mockReturnValue({ id: "123", email: "test@example.com" }),
} as unknown as User;

const mockAuthMessage: AuthMessage = {
  message: "Success",
  user: mockUser,
  token: "mockToken",
};

const mockMessage: Message = { message: "Success" };

const mockUserService = {
  create: jest.fn().mockResolvedValue(mockAuthMessage),
  login: jest.fn().mockResolvedValue(mockAuthMessage),
  decodeToken: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue(mockMessage),
  validateEmail: jest.fn().mockResolvedValue("Conta validada com sucesso"),
  delete: jest.fn().mockResolvedValue(mockMessage),
};

const mockUtilsService = {
  createAlertResponse: jest.fn(),
  createValidationButton: jest.fn(),
};

const mockEventEmitter = {
  emit: jest.fn(),
};

describe("UserController", () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a user and return AuthMessage", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        name: "Test User",
        password: "password",
      };

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockAuthMessage);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe("login", () => {
    it("should log in a user and return AuthMessage", async () => {
      const loginUserDto: LoginUserDto = {
        email: "test@example.com",
        password: "password",
      };

      const result = await controller.login(loginUserDto);

      expect(result).toEqual(mockAuthMessage);
      expect(mockUserService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });

  describe("decodeToken", () => {
    it("should decode a token and return the user", async () => {
      const result = await controller.decodeToken(mockToken);

      expect(result).toEqual(mockUser);
      expect(mockUserService.decodeToken).toHaveBeenCalledWith(mockToken);
    });
  });

  describe("update", () => {
    it("should update a user and return a success message", async () => {
      const updateUserDto: UpdateUserDto = {
        email: "newemail@example.com",
        password: "newPassword",
      };

      const result = await controller.update("123", updateUserDto);

      expect(result).toEqual(mockMessage);
      expect(mockUserService.update).toHaveBeenCalledWith("123", updateUserDto);
    });
  });

  describe("validateEmail", () => {
    it("should validate user email", async () => {
      mockUtilsService.createAlertResponse.mockResolvedValue(
        "Conta validada com sucesso",
      );
      
      const result = await controller.validateEmail(mockToken);

      expect(result).toEqual("Conta validada com sucesso");
    });
  });

  describe("delete", () => {
    it("should delete a user and return a success message", async () => {
      const result = await controller.delete("123");

      expect(result).toEqual(mockMessage);
      expect(mockUserService.delete).toHaveBeenCalledWith("123");
    });
  });
});
