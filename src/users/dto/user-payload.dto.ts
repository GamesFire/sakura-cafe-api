import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsString, IsInt, IsNotEmpty, Min } from "class-validator";
import { IsNotBlank } from "src/validators/is-not-blank.validator";

export class UserPayloadDto {
  @ApiProperty({
    type: Number,
    description: "Унікальний ідентифікатор користувача",
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: "ID має бути цілим числом" })
  @Min(1, { message: "ID має бути позитивним числом" })
  readonly id: number;

  @ApiProperty({
    type: String,
    description: "Ім'я користувача",
    example: "Джон Доу",
  })
  @IsString({ message: "Ім'я має бути рядком" })
  @IsNotEmpty({ message: "Ім'я не може бути порожнім" })
  @IsNotBlank({
    message: "Ім'я не може бути порожнім або складатися лише з пробілів",
  })
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
    description: "Роль користувача",
    example: "guest",
  })
  @IsString({ message: "Роль має бути рядком" })
  @IsNotEmpty({ message: "Роль не може бути порожньою" })
  readonly role: string;
}
