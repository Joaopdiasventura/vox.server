import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import { SendEmailDto } from "./dto/send-email.dto";

@Injectable()
export class EmailService {
  private transporter: Transporter;

  public constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      service: "Gmail",
      auth: {
        user: this.configService.get<string>("email.address"),
        pass: this.configService.get<string>("email.password"),
      },
    });
  }

  public async sendMail(sendEmailDto: SendEmailDto): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"VOX" <${this.configService.get<string>("email.address")}>`,
        ...sendEmailDto,
      });
    } catch {
      throw new Error(
        "Erro ao enviar o email, tente novamente mais tarde ou contate o suporte",
      );
    }
  }
}
