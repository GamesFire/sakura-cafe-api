import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsNumber,
  IsString,
  Min,
  IsPositive,
  IsNotEmpty,
  Length,
  Max,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayNotEmpty,
  IsInt,
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
    maximum: 999999,
    example: 599,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Вартість їжі має бути числом" })
  @Min(0, { message: "Вартість їжі повинна бути щонайменше 0" })
  @Max(999999, {
    message: "Вартість їжі не повинна перевищувати 999999",
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

  @ApiProperty({
    type: [Number],
    description:
      "Масив ідентифікаторів інгредієнтів, які потрібно додати до їжі",
    example: [1, 2, 3],
  })
  @IsArray({
    message: "Масив ідентифікаторів інгредієнтів повинен бути масивом",
  })
  @ArrayMinSize(1, {
    message:
      "Масив ідентифікаторів інгредієнтів повинен містити принаймні один елемент",
  })
  @ArrayMaxSize(100, {
    message:
      "Масив ідентифікаторів інгредієнтів повинен містити не більше 100 елементів",
  })
  @ArrayNotEmpty({
    message: "Масив ідентифікаторів інгредієнтів не може бути порожнім",
  })
  @IsInt({
    each: true,
    message:
      "Елементи масиву ідентифікаторів інгредієнтів повинні бути цілими числами",
  })
  @IsPositive({
    each: true,
    message:
      "Елементи масиву ідентифікаторів інгредієнтів повинні бути позитивними числами",
  })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      value = [value];
    }
    return value
      .map(Number)
      .filter((id: any) => !isNaN(id) && id > 0 && Number.isInteger(id));
  })
  readonly ingredientsIds: number[];
}
