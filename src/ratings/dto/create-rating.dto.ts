import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, Max, Min } from "class-validator";

export class CreateRatingDto {
  @ApiProperty({
    type: Number,
    description: "Рейтингове значення",
    example: 3,
    minimum: 0,
    maximum: 5,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Рейтингове значення повинно бути числом" })
  @Min(0, { message: "Рейтингове значення повинно бути не менше 0" })
  @Max(5, { message: "Рейтингове значення повинно бути не більше 5" })
  @IsNotEmpty({ message: "Рейтингове значення не може бути порожнім" })
  readonly rate: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
    description: "Ідентифікатор їжі, що оцінюється",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Ідентифікатор їжі повинен бути числом" })
  @IsPositive({
    message: "Ідентифікатор їжі повинен бути позитивним числом",
  })
  @IsNotEmpty({ message: "Ідентифікатор їжі не може бути порожнім" })
  readonly foodId: number;
}
