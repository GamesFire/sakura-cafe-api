import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendActivationMail(to: string, link: string): Promise<void> {
    await this.mailerService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Активуйте свій обліковий запис на SakuraCafe`,
      text: "",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p style="font-size: 16px;">Шановний користувачу,</p>
          <p style="font-size: 16px;">Дякуємо за реєстрацію на SakuraCafe!</p>
          <p style="font-size: 16px;">Будь ласка, натисніть на кнопку нижче, щоб активувати свій обліковий запис:</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${link}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-size: 16px;">Активувати обліковий запис</a>
          </div>
          <p style="font-size: 16px;">Якщо ви не ініціювали цю реєстрацію, будь ласка, ігноруйте цей лист.</p>
          <p style="font-size: 16px;">З повагою, <br/>Команда підтримки SakuraCafe</p>
        </div>
      `,
    });
  }
}
