import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: "Ім'я користувача",
    example: "Джон Доу",
  })
  @IsString({ message: "Ім'я має бути рядком" })
  @IsNotEmpty({ message: "Ім'я не може бути порожнім" })
  readonly name: string;

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

  @ApiProperty({
    type: String,
    description: "Посилання для активації облікового запису користувача",
    example: "b9aa533e-0e87-4554-b8b1-b7819b9e0949",
  })
  readonly activationLink: string;
}
