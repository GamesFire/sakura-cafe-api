import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  IsPositive,
  IsNotEmpty,
  Length,
  Max,
} from "class-validator";

export class UpdateFoodDto {
  @ApiProperty({
    type: Number,
    description: "Ідентифікатор їжі, яку потрібно оновити",
    minimum: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber(
    {},
    { message: "Ідентифікатор їжі, яку потрібно оновити повинен бути числом" }
  )
  @IsPositive({
    message:
      "Ідентифікатор їжі, яку потрібно оновити повинен бути позитивним числом",
  })
  @IsNotEmpty({
    message: "Ідентифікатор їжі, яку потрібно оновити не може бути порожнім",
  })
  readonly id: number;

  @ApiProperty({
    type: String,
    description: "Нова назва їжі",
    minLength: 1,
    maxLength: 255,
    example: "Нігірі лосось",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Нова назва їжі має бути рядком" })
  @Length(1, 255, {
    message: "Довжина нової назви їжі має бути від 1 до 255 символів",
  })
  @IsNotEmpty({ message: "Нова назва їжі не може бути порожньою" })
  readonly newName?: string;

  @ApiProperty({
    type: Number,
    description: "Нова ціна їжі",
    minimum: 0,
    maximum: 999999.99,
    example: 599.99,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: "Нова вартість їжі має бути числом" })
  @Min(0, { message: "Нова вартість їжі повинна бути щонайменше 0" })
  @Max(999999.99, {
    message: "Нова вартість їжі не повинна перевищувати 999999.99",
  })
  @IsNotEmpty({ message: "Нова вартість їжі не може бути порожньою" })
  readonly newPrice?: number;

  @ApiProperty({
    type: Number,
    description: "Новий рейтинг їжі",
    minimum: 0,
    maximum: 5,
    example: 4.5,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: "Новий рейтинг їжі повинен бути числом" })
  @Min(0, { message: "Новий рейтинг їжі повинен бути не менше 0" })
  @Max(5, { message: "Новий рейтинг їжі повинен бути не більше 5" })
  @IsNotEmpty({ message: "Новий рейтинг їжі не може бути порожнім" })
  readonly newRating?: number;

  @ApiProperty({
    type: Number,
    description: "Новий ідентифікатор категорії їжі",
    minimum: 1,
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber(
    {},
    { message: "Новий ідентифікатор категорії їжі повинен бути числом" }
  )
  @IsPositive({
    message: "Новий ідентифікатор категорії їжі повинен бути позитивним числом",
  })
  @IsNotEmpty({
    message: "Новий ідентифікатор категорії їжі не може бути порожнім",
  })
  readonly newCategoryId?: number;
}
