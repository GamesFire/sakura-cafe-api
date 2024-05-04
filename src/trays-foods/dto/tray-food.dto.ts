import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class TrayFoodDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
    description: "Ідентифікатор їжі, який потрібно додати або видалити з таці",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Ідентифікатор їжі повинен бути числом" })
  @IsPositive({ message: "Ідентифікатор їжі повинен бути позитивним числом" })
  @IsNotEmpty({ message: "Ідентифікатор їжі не може бути порожнім" })
  readonly foodId: number;
}
