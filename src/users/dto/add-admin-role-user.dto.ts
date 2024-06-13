import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class AddAdminRoleUserDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
    description:
      "Ідентифікатор користувача, якому буде додано роль адміністратора",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Ідентифікатор користувача повинен бути числом" })
  @IsPositive({
    message: "Ідентифікатор користувача повинен бути позитивним числом",
  })
  @IsNotEmpty({ message: "Ідентифікатор користувача не може бути порожнім" })
  readonly userId: number;
}
