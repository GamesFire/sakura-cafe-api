import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FoodIngredient } from "./food-ingredient.entity";
import { Repository, type DeleteResult } from "typeorm";
import { FoodsService } from "src/foods/foods.service";
import { IngredientsService } from "src/ingredients/ingredients.service";
import { FoodIngredientDto } from "./dto/food-ingredient.dto";

@Injectable()
export class FoodsIngredientsService {
  constructor(
    @InjectRepository(FoodIngredient)
    private readonly foodIngredientRepository: Repository<FoodIngredient>,
    private readonly foodService: FoodsService,
    private readonly ingredientService: IngredientsService
  ) {}

  public async addIngredientToFood(
    dto: FoodIngredientDto
  ): Promise<FoodIngredient> {
    const ingredient = await this.ingredientService.getIngredientById(
      dto.ingredientId
    );

    if (!ingredient) {
      throw new NotFoundException(
        `Інгредієнт з ідентифікатором ${dto.ingredientId} не знайдено`
      );
    }

    const food = await this.foodService.getFoodById(dto.foodId);

    if (!food) {
      throw new NotFoundException(
        `Їжа з ідентифікатором ${dto.foodId} не знайдено`
      );
    }

    const existingFoodIngredient =
      await this.foodIngredientRepository.findOneBy({
        food,
        ingredient,
      });

    if (existingFoodIngredient) {
      throw new ConflictException(
        `Інгредієнт з ідентифікатором ${dto.ingredientId} вже існує в їжі`
      );
    }

    const foodIngredient = new FoodIngredient();
    foodIngredient.food = food;
    foodIngredient.ingredient = ingredient;

    await this.foodIngredientRepository.save(foodIngredient);

    return foodIngredient;
  }

  public async deleteIngredientFromFood(
    dto: FoodIngredientDto
  ): Promise<DeleteResult> {
    const ingredient = await this.ingredientService.getIngredientById(
      dto.ingredientId
    );

    if (!ingredient) {
      throw new NotFoundException(
        `Інгредієнт з ідентифікатором ${dto.ingredientId} не знайдено`
      );
    }

    const food = await this.foodService.getFoodById(dto.foodId);

    if (!food) {
      throw new NotFoundException(
        `Їжа з ідентифікатором ${dto.foodId} не знайдено`
      );
    }

    const foodIngredient = await this.foodIngredientRepository.findOneBy({
      food,
      ingredient,
    });

    if (!foodIngredient) {
      throw new NotFoundException(
        `Інгредієнт з ідентифікатором ${dto.ingredientId} не знайдено в їжі`
      );
    }

    return await this.foodIngredientRepository.delete(foodIngredient.id);
  }
}
