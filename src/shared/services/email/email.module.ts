import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { SendEmailEvent } from "./events/send-email.event";

@Module({
  providers: [EmailService, SendEmailEvent],
})
export class EmailModule {}
