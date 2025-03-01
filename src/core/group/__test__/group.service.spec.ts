import { Test, TestingModule } from "@nestjs/testing";
import { GroupService } from "../group.service";
import { Group } from "../entities/group.entity";
import { UserService } from "../../user/user.service";
import { User } from "../../user/entities/user.entity";
import { NotFoundException } from "@nestjs/common";

const mockGroup = {
  id: "123",
  name: "test",
  user: "321",
} as Group;

const mockUser = {
  id: "321",
} as User;

const mockGroupRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findManyByUser: jest.fn(),
  findManyByGroup: jest.fn(),
  getResult: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
};

describe("GroupService", () => {
  let groupService: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        { provide: "GroupRepository", useValue: mockGroupRepository },
        { provide: UserService, useValue: mockUserRepository },
      ],
    }).compile();

    groupService = module.get<GroupService>(GroupService);
  });

  it("should be defined", () => {
    expect(groupService).toBeDefined();
  });

  describe("create", () => {
    it("should create a new group and return a message", async () => {
      mockUserRepository.findById.mockReturnValue(mockUser);
      mockGroupRepository.create.mockReturnValue(mockGroup);

      const result = await groupService.create({ name: "test", user: "321" });

      expect(result).toEqual({ message: "Grupo criado com sucesso" });
    });

    it("should not create a new group and throw a user not found exception", async () => {
      mockUserRepository.findById.mockRejectedValue(new NotFoundException());
      mockGroupRepository.create.mockReturnValue(mockGroup);

      await expect(
        groupService.create({ name: "test", user: "321" }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should not create a new group and throw a group not found exception", async () => {
      mockUserRepository.findById.mockReturnValue(mockUser);
      mockGroupRepository.findById.mockResolvedValue(null);
      mockGroupRepository.create.mockReturnValue(mockGroup);

      await expect(
        groupService.create({ name: "test", user: "321", group: "132" }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("findById", () => {
    it("should return a group", async () => {
      mockGroupRepository.findById.mockReturnValue(mockGroup);

      const result = await groupService.findById("123");
      expect(result).toBe(mockGroup);
    });

    it("should throw a not found exception", async () => {
      mockGroupRepository.findById.mockResolvedValue(null);

      await expect(groupService.findById("123")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("findManyByUser", () => {
    it("should return a list of groups for a user", async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockGroupRepository.findManyByUser.mockResolvedValue([mockGroup]);

      const result = await groupService.findManyByUser("321", 1);
      expect(result).toEqual([mockGroup]);
    });

    it("should throw a user not found exception", async () => {
      mockUserRepository.findById.mockRejectedValue(new NotFoundException());

      await expect(groupService.findManyByUser("321", 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("findManyByGroup", () => {
    it("should return a list of groups by group id", async () => {
      mockGroupRepository.findById.mockResolvedValue(mockGroup);
      mockGroupRepository.findManyByGroup.mockResolvedValue([mockGroup]);

      const result = await groupService.findManyByGroup("123", 1);
      expect(result).toEqual([mockGroup]);
    });

    it("should throw a group not found exception", async () => {
      mockGroupRepository.findById.mockResolvedValue(null);

      await expect(groupService.findManyByGroup("123", 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("getResult", () => {
    it("should return the vote results for a group", async () => {
      const group = "456";
      const mockResult = {
        group: { _id: group, name: "test" },
        participants: [{ name: "123", votes: 10 }],
      };

      mockGroupRepository.getResult.mockResolvedValue(mockResult);

      const result = await groupService.getResult(group);

      expect(result).toEqual(mockResult);
      expect(mockGroupRepository.getResult).toHaveBeenCalledWith(group);
    });
  });

  describe("update", () => {
    it("should update a group and return a success message", async () => {
      const updateGroupDto = { name: "updated group" };
      mockGroupRepository.findById.mockResolvedValue(mockGroup);
      mockGroupRepository.update.mockResolvedValue(undefined);

      const result = await groupService.update("123", updateGroupDto);
      expect(result).toEqual({ message: "Grupo atualizado com sucesso" });
    });

    it("should throw a group not found exception when updating", async () => {
      const updateGroupDto = { name: "updated group" };
      mockGroupRepository.findById.mockResolvedValue(null);

      await expect(groupService.update("123", updateGroupDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("delete", () => {
    it("should delete a group and return a success message", async () => {
      mockGroupRepository.findById.mockResolvedValue(mockGroup);
      mockGroupRepository.delete.mockResolvedValue(undefined);

      const result = await groupService.delete("123");
      expect(result).toEqual({ message: "Grupo deletado com sucesso" });
    });

    it("should throw a group not found exception when deleting", async () => {
      mockGroupRepository.findById.mockResolvedValue(null);

      await expect(groupService.delete("123")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
