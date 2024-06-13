import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class ProcessedFeedbackDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
    description:
      "Ідентифікатор зворотного зв'язку, який потрібно відмітити, як оброблений",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber(
    {},
    { message: "Ідентифікатор зворотного зв'язку повинен бути числом" }
  )
  @IsPositive({
    message: "Ідентифікатор зворотного зв'язку повинен бути позитивним числом",
  })
  @IsNotEmpty({
    message: "Ідентифікатор зворотного зв'язку не може бути порожнім",
  })
  readonly feedbackId: number;
}
