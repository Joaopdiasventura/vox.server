import { SendEmailDto } from "./../dto/send-email.dto";
import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "./../email.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendEmailEvent {
  public constructor(private readonly emailService: EmailService) {}

  @OnEvent("email.send")
  public async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    this.emailService.sendMail(sendEmailDto);
  }
}
