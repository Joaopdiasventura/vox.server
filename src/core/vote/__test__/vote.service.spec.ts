import { Test, TestingModule } from "@nestjs/testing";
import { VoteService } from "../vote.service";
import { ParticipantService } from "../../participant/participant.service";
import { CreateVoteDto } from "../dto/create-vote.dto";
import { NotFoundException } from "@nestjs/common";

const mockVoteRepository = {
  create: jest.fn(),
  getResult: jest.fn(),
};

const mockParticipantService = {
  findById: jest.fn(),
};

describe("VoteService", () => {
  let service: VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        { provide: "VoteRepository", useValue: mockVoteRepository },
        { provide: ParticipantService, useValue: mockParticipantService },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a vote and emit an event", async () => {
      const createVoteDto: CreateVoteDto = { participant: "123" };
      const mockParticipant = { id: "123", group: "456" };

      mockParticipantService.findById.mockResolvedValue(mockParticipant);
      mockVoteRepository.create.mockResolvedValue(undefined);

      const result = await service.create(createVoteDto);

      expect(result).toEqual({ message: "Voto registrado com sucesso" });
      expect(mockParticipantService.findById).toHaveBeenCalledWith("123");
      expect(mockVoteRepository.create).toHaveBeenCalledWith(createVoteDto);
    });

    it("should throw NotFoundException if participant is not found", async () => {
      const createVoteDto: CreateVoteDto = { participant: "999" };

      mockParticipantService.findById.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.create(createVoteDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
