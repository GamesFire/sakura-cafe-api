import { MailerOptions } from "@nestjs-modules/mailer";
import { registerAs } from "@nestjs/config";

export default registerAs(
  "mailer",
  (): MailerOptions => ({
    transport: {
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
  })
);
