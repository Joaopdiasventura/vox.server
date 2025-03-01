import { Test, TestingModule } from "@nestjs/testing";
import { GroupController } from "../group.controller";
import { GroupService } from "../group.service";
import { CreateGroupDto } from "../dto/create-group.dto";
import { UpdateGroupDto } from "../dto/update-group.dto";
import { Group } from "../entities/group.entity";
import { Message } from "../../../shared/interfaces/message";
import { UserService } from "../../user/user.service";

const mockGroup = {
  id: "123",
  name: "Test Group",
  user: "321",
} as Group;

const mockMessage: Message = { message: "Operação realizada com sucesso" };

const mockGroupService = {
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

describe("GroupController", () => {
  let controller: GroupController;
  let service: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        { provide: GroupService, useValue: mockGroupService },
        { provide: UserService, useValue: mockUserRepository },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
    service = module.get<GroupService>(GroupService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a new group", async () => {
      const createGroupDto: CreateGroupDto = {
        name: "Test Group",
        user: "321",
      };
      jest.spyOn(service, "create").mockResolvedValue(mockMessage);

      const result = await controller.create(createGroupDto);
      expect(result).toEqual(mockMessage);
      expect(service.create).toHaveBeenCalledWith(createGroupDto);
    });
  });

  describe("findById", () => {
    it("should return a group by id", async () => {
      jest.spyOn(service, "findById").mockResolvedValue(mockGroup);

      const result = await controller.findById("123");
      expect(result).toEqual(mockGroup);
      expect(service.findById).toHaveBeenCalledWith("123");
    });
  });

  describe("findManyByUser", () => {
    it("should return groups for a user", async () => {
      jest.spyOn(service, "findManyByUser").mockResolvedValue([mockGroup]);

      const result = await controller.findManyByUser("321", 1);
      expect(result).toEqual([mockGroup]);
      expect(service.findManyByUser).toHaveBeenCalledWith("321", 1);
    });

    it("should handle negative page numbers", async () => {
      jest.spyOn(service, "findManyByUser").mockResolvedValue([mockGroup]);

      const result = await controller.findManyByUser("321", -1);
      expect(result).toEqual([mockGroup]);
      expect(service.findManyByUser).toHaveBeenCalledWith("321", 0);
    });
  });

  describe("findManyByGroup", () => {
    it("should return groups by group id", async () => {
      jest.spyOn(service, "findManyByGroup").mockResolvedValue([mockGroup]);

      const result = await controller.findManyByGroup("123", 1);
      expect(result).toEqual([mockGroup]);
      expect(service.findManyByGroup).toHaveBeenCalledWith("123", 1);
    });

    it("should handle negative page numbers", async () => {
      jest.spyOn(service, "findManyByGroup").mockResolvedValue([mockGroup]);

      const result = await controller.findManyByGroup("123", -1);
      expect(result).toEqual([mockGroup]);
      expect(service.findManyByGroup).toHaveBeenCalledWith("123", 0);
    });
  });

  describe("getResult", () => {
    it("should return the vote results for a group", async () => {
      const group = "456";
      const mockResult = {
        group: { _id: group, name: "test" },
        participants: [{ name: "123", votes: 10 }],
      };

      mockGroupService.getResult.mockResolvedValue(mockResult);

      const result = await controller.getResult(group);

      expect(result).toEqual(mockResult);
      expect(mockGroupService.getResult).toHaveBeenCalledWith(group);
    });
  });

  describe("update", () => {
    it("should update a group", async () => {
      const updateGroupDto: UpdateGroupDto = { name: "Updated Group" };
      jest.spyOn(service, "update").mockResolvedValue(mockMessage);

      const result = await controller.update("123", updateGroupDto);
      expect(result).toEqual(mockMessage);
      expect(service.update).toHaveBeenCalledWith("123", updateGroupDto);
    });
  });

  describe("delete", () => {
    it("should delete a group", async () => {
      jest.spyOn(service, "delete").mockResolvedValue(mockMessage);

      const result = await controller.delete("123");
      expect(result).toEqual(mockMessage);
      expect(service.delete).toHaveBeenCalledWith("123");
    });
  });
});
