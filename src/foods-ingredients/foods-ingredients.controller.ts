import { Body, Controller, Delete, Post, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FoodsIngredientsService } from "./foods-ingredients.service";
import { FoodIngredient } from "./food-ingredient.entity";
import { AdminGuard } from "src/guards/admin.guard";
import { FoodIngredientDto } from "./dto/food-ingredient.dto";

@ApiTags("Їжа-Інгредієнти")
@Controller("foods-ingredients")
export class FoodsIngredientsController {
  constructor(
    private readonly foodIngredientService: FoodsIngredientsService
  ) {}

  @ApiOperation({ summary: "Додати інгредієнт до їжі" })
  @ApiResponse({
    status: 200,
    description: "Інгредієнт успішно додано до їжі",
    type: FoodIngredient,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({ description: "Інгредієнт або їжу не знайдено" })
  @ApiConflictResponse({ description: "Інгредієнт вже є в їжі" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Post()
  public async addIngredientToFood(
    @Body() foodIngredientDto: FoodIngredientDto
  ) {
    return this.foodIngredientService.addIngredientToFood(foodIngredientDto);
  }

  @ApiOperation({ summary: "Видалити інгредієнт з їжі" })
  @ApiResponse({
    status: 200,
    description: "Інгредієнт успішно видалено з їжі",
    schema: {
      type: "object",
      properties: {
        raw: { type: "object" },
        affected: { type: "number", nullable: true },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Не знайдено інгредієнт, їжу або інгредієнт не знайдено у їжі",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Delete()
  public async deleteIngredientFromFood(
    @Body() foodIngredientDto: FoodIngredientDto
  ) {
    return this.foodIngredientService.deleteIngredientFromFood(
      foodIngredientDto
    );
  }
}
