import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";
import { IsNotBlank } from "src/validators/is-not-blank.validator";

export class CreateFeedbackDto {
  @ApiProperty({
    type: String,
    description: "Тема зворотного зв'язку",
    minLength: 1,
    maxLength: 255,
    example: "Якість обслуговування",
  })
  @IsString({ message: "Тема зворотного зв'язку має бути рядком" })
  @Length(1, 255, {
    message: "Довжина теми зворотного зв'язку має бути від 1 до 255 символів",
  })
  @IsNotEmpty({ message: "Тема зворотного зв'язку не може бути порожньою" })
  @IsNotBlank({
    message:
      "Тема зворотного зв'язку не може бути порожньою або складатися лише з пробілів",
  })
  readonly subject: string;

  @ApiProperty({
    type: String,
    description: "Повідомлення зворотного зв'язку",
    minLength: 1,
    maxLength: 1000,
    example:
      "Обслуговування було чудовим, але час очікування був занадто довгим.",
  })
  @IsString({ message: "Повідомлення зворотного зв'язку має бути рядком" })
  @Length(1, 1000, {
    message:
      "Довжина повідомлення зворотного зв'язку має бути від 1 до 1000 символів",
  })
  @IsNotEmpty({
    message: "Повідомлення зворотного зв'язку не може бути порожнім",
  })
  @IsNotBlank({
    message:
      "Повідомлення зворотного зв'язку не може бути порожнім або складатися лише з пробілів",
  })
  readonly message: string;
}
