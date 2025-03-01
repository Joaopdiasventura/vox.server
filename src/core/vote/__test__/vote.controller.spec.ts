import { Test, TestingModule } from "@nestjs/testing";
import { VoteController } from "../vote.controller";
import { VoteService } from "../vote.service";
import { CreateVoteDto } from "../dto/create-vote.dto";

const mockVoteService = {
  create: jest.fn(),
  getResult: jest.fn(),
};

describe("VoteController", () => {
  let controller: VoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [{ provide: VoteService, useValue: mockVoteService }],
    }).compile();

    controller = module.get<VoteController>(VoteController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a vote and return a success message", async () => {
      const createVoteDto: CreateVoteDto = { participant: "123" };
      const mockResponse = { message: "Voto registrado com sucesso" };

      mockVoteService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(createVoteDto);

      expect(result).toEqual(mockResponse);
      expect(mockVoteService.create).toHaveBeenCalledWith(createVoteDto);
    });
  });
});
