import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    description: "Назва категорії",
    minLength: 1,
    maxLength: 50,
    example: "Суші",
  })
  @IsString({ message: "Назва категорії має бути рядком" })
  @Length(1, 50, {
    message: "Назва категорії повинна містити від 1 до 50 символів",
  })
  @IsNotEmpty({ message: "Назва категорії не може бути порожньою" })
  readonly name: string;
}
