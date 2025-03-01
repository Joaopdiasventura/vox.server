import { Test, TestingModule } from "@nestjs/testing";
import { UtilsService } from "../utils.service";
import { ConfigService } from "@nestjs/config";

const mockConfigService = {
  get: jest.fn(),
};

describe("UtilsService", () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilsService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createAlertResponse", () => {
    it("should return an HTML response with an alert and window close script", () => {
      const message = "Test Alert Message";
      const result = service.createAlertResponse(message);

      expect(result).toContain("<html>");
      expect(result).toContain("<body>");
      expect(result).toContain(`<script type="text/javascript">`);
      expect(result).toContain(`alert('${message}');`);
      expect(result).toContain(`window.close();`);
      expect(result).toContain("</script>");
    });
  });

  describe("createValidationButton", () => {
    it("should return an HTML string with a validation button and correct URL", () => {
      const token = "testToken";
      const url = "http://localhost:3000";
      mockConfigService.get.mockReturnValue(url);

      const result = service.createValidationButton(token);

      expect(result).toContain('<div style="text-align: center;">');
      expect(result).toContain(
        '<a href="http://localhost:3000/user/validateEmail/testToken">',
      );
      expect(result).toContain("<button");
      expect(result).toContain("VALIDAR CONTA");
    });

    it("should use the URL from the ConfigService", () => {
      const token = "testToken";
      const customUrl = "https://example.com";
      mockConfigService.get.mockReturnValue(customUrl);

      const result = service.createValidationButton(token);

      expect(mockConfigService.get).toHaveBeenCalledWith("url");
      expect(result).toContain(
        `<a href="${customUrl}/user/validateEmail/${token}">`,
      );
    });
  });
});
