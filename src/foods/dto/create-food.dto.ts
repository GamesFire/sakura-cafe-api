import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNumber,
  IsString,
  Min,
  IsPositive,
  IsNotEmpty,
  Length,
  Max,
} from "class-validator";

export class CreateFoodDto {
  @ApiProperty({
    type: String,
    description: "Назва їжі",
    minLength: 1,
    maxLength: 255,
    example: "Нігірі лосось",
  })
  @IsString({ message: "Назва їжі має бути рядком" })
  @Length(1, 255, {
    message: "Довжина назви їжі має бути від 1 до 255 символів",
  })
  @IsNotEmpty({ message: "Назва їжі не може бути порожньою" })
  readonly name: string;

  @ApiProperty({
    type: Number,
    description: "Назва їжі не може бути порожньою",
    minimum: 0,
    maximum: 999999.99,
    example: 599.99,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Вартість їжі має бути числом" })
  @Min(0, { message: "Вартість їжі повинна бути щонайменше 0" })
  @Max(999999.99, {
    message: "Вартість їжі не повинна перевищувати 999999.99",
  })
  @IsNotEmpty({ message: "Вартість їжі не може бути порожньою" })
  readonly price: number;

  @ApiProperty({
    type: Number,
    description: "Рейтинг їжі",
    minimum: 0,
    maximum: 5,
    example: 4.5,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Рейтинг їжі повинен бути числом" })
  @Min(0, { message: "Рейтинг їжі повинен бути не менше 0" })
  @Max(5, { message: "Рейтинг їжі повинен бути не більше 5" })
  @IsNotEmpty({ message: "Рейтинг їжі не може бути порожнім" })
  readonly rating: number;

  @ApiProperty({
    type: Number,
    description: "Ідентифікатор категорії, до якої належить їжа",
    minimum: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Ідентифікатор категорії їжі повинен бути числом" })
  @IsPositive({
    message: "Ідентифікатор категорії їжі повинен бути позитивним числом",
  })
  @IsNotEmpty({ message: "Ідентифікатор категорії їжі не може бути порожнім" })
  readonly categoryId: number;
}
