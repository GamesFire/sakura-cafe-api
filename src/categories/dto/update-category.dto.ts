import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from "class-validator";

export class UpdateCategoryDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
    description: "Ідентифікатор категорії, яку потрібно оновити",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Ідентифікатор категорії повинен бути числом" })
  @IsPositive({
    message: "Ідентифікатор категорії повинен бути позитивним числом",
  })
  @IsNotEmpty({ message: "Ідентифікатор категорії не може бути порожнім" })
  readonly id: number;

  @ApiProperty({
    type: String,
    description: "Нова назва категорії",
    maxLength: 50,
    minLength: 1,
    example: "Суші",
  })
  @IsString({ message: "Нова назва категорії має бути рядком" })
  @Length(1, 50, {
    message: "Нова назва категорії повинна містити від 1 до 50 символів",
  })
  @IsNotEmpty({ message: "Нова назва категорії не може бути порожньою" })
  readonly newName: string;
}
