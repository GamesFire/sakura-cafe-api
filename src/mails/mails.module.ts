import { Module } from "@nestjs/common";
import { MailsService } from "./mails.service";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  providers: [MailsService],
  imports: [MailerModule],
  exports: [MailsService],
})
export class MailModule {}
