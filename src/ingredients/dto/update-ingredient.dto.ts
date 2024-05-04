import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
  IsNumber,
  IsString,
  IsPositive,
  IsNotEmpty,
  Length,
} from "class-validator";

export class UpdateIngredientDto {
  @ApiProperty({
    type: Number,
    description: "Ідентифікатор інгредієнту, який потрібно оновити",
    minimum: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message:
        "Ідентифікатор інгредієнту, який потрібно оновити повинен бути числом",
    }
  )
  @IsPositive({
    message:
      "Ідентифікатор інгредієнту, який потрібно оновити повинен бути позитивним числом",
  })
  @IsNotEmpty({
    message:
      "Ідентифікатор інгредієнту, який потрібно оновити не може бути порожнім",
  })
  readonly id: number;

  @ApiProperty({
    type: String,
    description: "Нова назва інгредієнту",
    minLength: 1,
    maxLength: 255,
    example: "Норі",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Нова назва інгредієнту має бути рядком" })
  @Length(1, 255, {
    message: "Довжина нової назви інгредієнту має бути від 1 до 255 символів",
  })
  @IsNotEmpty({ message: "Нова назва інгредієнту не може бути порожньою" })
  readonly newTitle?: string;
}
