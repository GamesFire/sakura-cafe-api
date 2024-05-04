import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  Length,
} from "class-validator";

export class CreateIngredientDto {
  @ApiProperty({
    type: String,
    description: "Назва інгредієнту",
    minLength: 1,
    maxLength: 255,
    example: "Норі",
  })
  @IsString({ message: "Назва інгредієнту має бути рядком" })
  @Length(1, 255, {
    message: "Довжина назви інгредієнту повинна бути від 1 до 255 символів",
  })
  @IsNotEmpty({ message: "Назва інгредієнту не може бути порожньою" })
  readonly title: string;
}
