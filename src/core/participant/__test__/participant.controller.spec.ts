import { Test, TestingModule } from "@nestjs/testing";
import { ParticipantController } from "../participant.controller";
import { ParticipantService } from "../participant.service";
import { CreateParticipantDto } from "../dto/create-participant.dto";
import { UpdateParticipantDto } from "../dto/update-participant.dto";
import { NotFoundException } from "@nestjs/common";
import { UserService } from "../../user/user.service";

const mockParticipantService = {
  create: jest.fn(),
  findAllByGroup: jest.fn(),
  findManyByGroup: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockUserService = {
  findById: jest.fn(),
};

describe("ParticipantController", () => {
  let controller: ParticipantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipantController],
      providers: [
        { provide: ParticipantService, useValue: mockParticipantService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<ParticipantController>(ParticipantController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a participant and return a success message", async () => {
      const createDto: CreateParticipantDto = {
        name: "John Doe",
        group: "456",
      };
      mockParticipantService.create.mockResolvedValue({
        message: "Participante registrado com sucesso",
      });

      const result = await controller.create(createDto);
      expect(result).toEqual({
        message: "Participante registrado com sucesso",
      });
      expect(mockParticipantService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe("findManyByGroup", () => {
    it("should return a list of participants by group", async () => {
      const group = "456";
      const page = 1;
      const mockParticipants = [{ id: "123", name: "John Doe", group }];
      mockParticipantService.findManyByGroup.mockResolvedValue(
        mockParticipants,
      );

      const result = await controller.findManyByGroup(group, page);
      expect(result).toEqual(mockParticipants);
      expect(mockParticipantService.findManyByGroup).toHaveBeenCalledWith(
        group,
        page,
      );
    });
  });

  describe("findAllByGroup", () => {
    it("should return a list of participants by group", async () => {
      const group = "456";
      const mockParticipants = [{ id: "123", name: "John Doe", group }];
      mockParticipantService.findAllByGroup.mockResolvedValue(mockParticipants);

      const result = await controller.findAllByGroup(group);
      expect(result).toEqual(mockParticipants);
      expect(mockParticipantService.findAllByGroup).toHaveBeenCalledWith(group);
    });
  });

  describe("update", () => {
    it("should update a participant and return a success message", async () => {
      const id = "123";
      const updateDto: UpdateParticipantDto = { name: "Updated Name" };
      mockParticipantService.update.mockResolvedValue({
        message: "Participante atualizado com sucesso",
      });

      const result = await controller.update(id, updateDto);
      expect(result).toEqual({
        message: "Participante atualizado com sucesso",
      });
      expect(mockParticipantService.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe("delete", () => {
    it("should delete a participant and return a success message", async () => {
      const id = "123";
      mockParticipantService.delete.mockResolvedValue({
        message: "Participante removido com sucesso",
      });

      const result = await controller.delete(id);
      expect(result).toEqual({ message: "Participante removido com sucesso" });
      expect(mockParticipantService.delete).toHaveBeenCalledWith(id);
    });

    it("should throw NotFoundException if participant is not found", async () => {
      const id = "999";
      mockParticipantService.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
