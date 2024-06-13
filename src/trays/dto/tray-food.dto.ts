import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, ArrayNotEmpty, IsNumber, IsPositive, IsInt } from "class-validator";

export class TrayFoodDto {
  @ApiProperty({
    type: [Number],
    description:
      "Масив ідентифікаторів їжі, які потрібно додати або видалити з таці",
    example: [1, 2, 3],
  })
  @IsArray({
    message: "Ідентифікатори їжі повинні бути в масиві",
  })
  @ArrayNotEmpty({ message: "Масив ідентифікаторів їжі не може бути порожнім" })
  @Type(() => Number)
  @IsNumber(
    {},
    { each: true, message: "Кожен ідентифікатор їжі має бути числом" }
  )
  @IsPositive({
    each: true,
    message: "Елементи масиву їжі має бути позитивним числом",
  })
  @IsInt({
    each: true,
    message:
      "Елементи масиву ідентифікаторів їжі повинні бути цілими числами",
  })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      value = [value];
    }
    return value
      .map(Number)
      .filter((id: any) => !isNaN(id) && id > 0 && Number.isInteger(id));
  })
  readonly foodIds: number[];
}
