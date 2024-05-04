import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class AcceptRejectOrderDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
    description: "Ідентифікатор замовлення для прийняття або відхилення",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Ідентифікатор замовлення повинен бути числом" })
  @IsPositive({
    message: "Ідентифікатор замовлення повинен бути позитивним числом",
  })
  @IsNotEmpty({ message: "Ідентифікатор замовлення не може бути порожнім" })
  readonly orderId: number;
}
