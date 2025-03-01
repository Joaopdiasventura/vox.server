import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../email.service";
import { createTransport, Transporter } from "nodemailer";
import { SendEmailDto } from "../dto/send-email.dto";

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));

describe("EmailService", () => {
  let service: EmailService;
  let transporterMock: jest.Mocked<Transporter>;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === "email.address") return "test@example.com";
      if (key === "email.password") return "testpassword";
      return undefined;
    }),
  };

  const mockSendEmailDto: SendEmailDto = {
    to: "test@example.com",
    subject: "Test Subject",
    html: "<h1>Test Email</h1>",
    attachments: [],
  };

  beforeEach(async () => {
    transporterMock = createTransport() as jest.Mocked<Transporter>;

    (createTransport as jest.Mock).mockReturnValue(transporterMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should send an email successfully", async () => {
    transporterMock.sendMail.mockResolvedValueOnce(true);

    await expect(service.sendMail(mockSendEmailDto)).resolves.toBeUndefined();

    expect(transporterMock.sendMail).toHaveBeenCalledTimes(1);
    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: `"VOX" <test@example.com>`,
      ...mockSendEmailDto,
    });
  });

  it("should throw an error if email sending fails", async () => {
    transporterMock.sendMail.mockRejectedValueOnce(new Error("SMTP Error"));

    await expect(service.sendMail(mockSendEmailDto)).rejects.toThrow(
      "Erro ao enviar o email, tente novamente mais tarde ou contate o suporte",
    );

    expect(transporterMock.sendMail).toHaveBeenCalledTimes(1);
  });
});
