import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class FoodIngredientDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
    description:
      "Ідентифікатор їжі, до якої буде додаватися або видалятися інгредієнт",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Ідентифікатор їжі повинен бути числом" })
  @IsPositive({ message: "Ідентифікатор їжі повинен бути позитивним числом" })
  @IsNotEmpty({ message: "Ідентифікатор їжі не може бути порожнім" })
  readonly foodId: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
    description:
      "Ідентифікатор інгредієнту, який потрібно додати або видалити до їжі",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Ідентифікатор інгредієнту повинен бути числом" })
  @IsPositive({
    message: "Ідентифікатор інгредієнту повинен бути позитивним числом",
  })
  @IsNotEmpty({ message: "Ідентифікатор інгредієнту не може бути порожнім" })
  readonly ingredientId: number;
}
