import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class ValidateUserDto {
  @ApiProperty({
    type: String,
    description: "Адреса електронної пошти користувача",
    example: "example@example.com",
  })
  @IsString({ message: "Адреса електронної пошти має бути рядком" })
  @IsEmail({}, { message: "Неправильний формат електронної пошти" })
  @IsNotEmpty({ message: "Адреса електронної пошти не може бути порожньою" })
  readonly email: string;

  @ApiProperty({
    type: String,
    description: "Пароль користувача",
    minLength: 6,
    maxLength: 32,
    example: "password123",
  })
  @IsString({ message: "Пароль повинен бути рядком" })
  @Length(6, 32, { message: "Пароль повинен містити від 6 до 32 символів" })
  @IsNotEmpty({ message: "Пароль не може бути порожнім" })
  readonly password: string;
}
