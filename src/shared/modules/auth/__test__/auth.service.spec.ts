import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

describe("AuthService", () => {
  let authService: AuthService;
  let configService: ConfigService;

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("generateToken", () => {
    it("should generate a token", async () => {
      const payload = "testPayload";
      const token = "testToken";
      mockJwtService.signAsync.mockResolvedValue(token);

      const result = await authService.generateToken(payload);

      expect(result).toBe(token);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload);
    });
  });

  describe("decodeToken", () => {
    it("should decode a valid token", async () => {
      const token = "validToken";
      const decoded = "decodedPayload";
      mockJwtService.verifyAsync.mockResolvedValue(decoded);

      const result = await authService.decodeToken(token);

      expect(result).toBe(decoded);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token);
    });

    it("should throw BadRequestException for an invalid token", async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(authService.decodeToken("invalidToken")).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("hashPassword", () => {
    it("should hash the password", async () => {
      const password = "plainPassword";
      const hashedPassword = "hashedPassword";
      const saltRounds = 10;
      mockConfigService.get.mockReturnValue(saltRounds);
      jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedPassword as never);

      const result = await authService.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, saltRounds);
      expect(configService.get).toHaveBeenCalledWith("salts");
    });
  });

  describe("comparePassword", () => {
    it("should not throw if passwords match", async () => {
      const password = "plainPassword";
      const hashedPassword = "hashedPassword";
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      await expect(
        authService.comparePassword(password, hashedPassword),
      ).resolves.not.toThrow();

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it("should throw UnauthorizedException if passwords do not match", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      await expect(
        authService.comparePassword("plainPassword", "wrongPassword"),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
