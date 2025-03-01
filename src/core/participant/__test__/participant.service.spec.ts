import { Test, TestingModule } from "@nestjs/testing";
import { ParticipantService } from "../participant.service";
import { GroupService } from "../../group/group.service";
import { NotFoundException } from "@nestjs/common";
import { Participant } from "../entities/participant.entity";
import { CreateParticipantDto } from "../dto/create-participant.dto";
import { UpdateParticipantDto } from "../dto/update-participant.dto";

const mockParticipant = {
  id: "123",
  name: "John Doe",
  group: "456",
} as Participant;

const mockGroup = {
  id: "456",
  name: "Test Group",
};

const mockParticipantRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAllByGroup: jest.fn(),
  findManyByGroup: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockGroupService = {
  findById: jest.fn(),
};

describe("ParticipantService", () => {
  let service: ParticipantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantService,
        {
          provide: "ParticipantRepository",
          useValue: mockParticipantRepository,
        },
        { provide: GroupService, useValue: mockGroupService },
      ],
    }).compile();

    service = module.get<ParticipantService>(ParticipantService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a participant and return a success message", async () => {
      mockGroupService.findById.mockResolvedValue(mockGroup);
      mockParticipantRepository.create.mockResolvedValue(undefined);

      const createDto: CreateParticipantDto = {
        name: "John Doe",
        group: "456",
      };
      const result = await service.create(createDto);

      expect(result).toEqual({
        message: "Participante registrado com sucesso",
      });
      expect(mockGroupService.findById).toHaveBeenCalledWith("456");
      expect(mockParticipantRepository.create).toHaveBeenCalledWith(createDto);
    });

    it("should throw NotFoundException if group is not found", async () => {
      mockGroupService.findById.mockRejectedValue(new NotFoundException());

      const createDto: CreateParticipantDto = {
        name: "John Doe",
        group: "999",
      };
      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("findById", () => {
    it("should return a participant", async () => {
      mockParticipantRepository.findById.mockResolvedValue(mockParticipant);

      const result = await service.findById("123");
      expect(result).toBe(mockParticipant);
      expect(mockParticipantRepository.findById).toHaveBeenCalledWith("123");
    });

    it("should throw NotFoundException if participant is not found", async () => {
      mockParticipantRepository.findById.mockResolvedValue(null);

      await expect(service.findById("999")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAllByGroup", () => {
    it("should return a list of participants by group", async () => {
      mockParticipantRepository.findAllByGroup.mockResolvedValue([
        mockParticipant,
      ]);

      const result = await service.findAllByGroup("456");
      expect(result).toEqual([mockParticipant]);
      expect(mockParticipantRepository.findAllByGroup).toHaveBeenCalledWith(
        "456",
      );
    });
  });

  describe("findManyByGroup", () => {
    it("should return a list of participants by group", async () => {
      mockParticipantRepository.findManyByGroup.mockResolvedValue([
        mockParticipant,
      ]);

      const result = await service.findManyByGroup("456", 1);
      expect(result).toEqual([mockParticipant]);
      expect(mockParticipantRepository.findManyByGroup).toHaveBeenCalledWith(
        "456",
        1,
      );
    });
  });

  describe("update", () => {
    it("should update a participant and return a success message", async () => {
      mockParticipantRepository.findById.mockResolvedValue(mockParticipant);
      mockParticipantRepository.update.mockResolvedValue(undefined);

      const updateDto: UpdateParticipantDto = { name: "Updated Name" };
      const result = await service.update("123", updateDto);

      expect(result).toEqual({
        message: "Participante atualizado com sucesso",
      });
      expect(mockParticipantRepository.update).toHaveBeenCalledWith(
        "123",
        updateDto,
      );
    });

    it("should throw NotFoundException if participant is not found", async () => {
      mockParticipantRepository.findById.mockResolvedValue(null);

      const updateDto: UpdateParticipantDto = { name: "Updated Name" };
      await expect(service.update("999", updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("delete", () => {
    it("should delete a participant and return a success message", async () => {
      mockParticipantRepository.findById.mockResolvedValue(mockParticipant);
      mockParticipantRepository.delete.mockResolvedValue(undefined);

      const result = await service.delete("123");

      expect(result).toEqual({ message: "Participante removido com sucesso" });
      expect(mockParticipantRepository.delete).toHaveBeenCalledWith("123");
    });

    it("should throw NotFoundException if participant is not found", async () => {
      mockParticipantRepository.findById.mockResolvedValue(null);

      await expect(service.delete("999")).rejects.toThrow(NotFoundException);
    });
  });
});
