import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Food } from "./food.entity";
import { CategoriesService } from "src/categories/categories.service";
import { FilesService } from "src/files/files.service";
import { IngredientsService } from "src/ingredients/ingredients.service";
import { In, Repository, type DeleteResult } from "typeorm";
import { CreateFoodDto } from "./dto/create-food.dto";
import { UpdateFoodDto } from "./dto/update-food.dto";
import { CustomUploadedFile } from "src/interfaces/CustomUploadedFile";

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
    private readonly categoryService: CategoriesService,
    private readonly fileService: FilesService,
    private readonly ingredientService: IngredientsService
  ) {}

  public async createFood(
    dto: CreateFoodDto,
    image: CustomUploadedFile
  ): Promise<Food> {
    const existingFood = await this.getFoodByName(dto.name);
    const category = await this.categoryService.getCategoryById(dto.categoryId);

    if (existingFood) {
      throw new ConflictException(`${dto.name} їжа вже існує`);
    }

    if (!category) {
      throw new NotFoundException(
        `Категорію з ідентифікатором ${dto.categoryId} не знайдено`
      );
    }

    const fileName = await this.fileService.createFile(image);
    const food = new Food();
    food.name = dto.name;
    food.price = dto.price;
    food.rating = dto.rating;
    food.image = fileName;
    food.category = category;
    food.ingredients = [];

    if (typeof dto.ingredientsIds === "string") {
      const ingredient = await this.ingredientService.getIngredientById(
        dto.ingredientsIds
      );

      if (!ingredient) {
        throw new NotFoundException(
          `Інгредієнт з ідентифікатором ${dto.ingredientsIds} не знайдено`
        );
      }

      food.ingredients.push(ingredient);
    } else {
      for (const ingredientId of dto.ingredientsIds) {
        const ingredient =
          await this.ingredientService.getIngredientById(ingredientId);

        if (!ingredient) {
          throw new NotFoundException(
            `Інгредієнт з ідентифікатором ${ingredientId} не знайдено`
          );
        }

        food.ingredients.push(ingredient);
      }
    }

    await this.saveFood(food);

    return food;
  }

  public async updateFood(
    dto: UpdateFoodDto,
    newImage?: CustomUploadedFile
  ): Promise<Food> {
    const existingFood = await this.getFoodById(dto.id);

    if (!existingFood) {
      throw new NotFoundException(
        `Їжу з ідентифікатором ${dto.id} не знайдено`
      );
    }

    existingFood.name = dto.newName ?? existingFood.name;
    existingFood.price = dto.newPrice ?? existingFood.price;
    existingFood.rating = dto.newRating ?? existingFood.rating;

    if (dto.newCategoryId) {
      const category = await this.categoryService.getCategoryById(
        dto.newCategoryId
      );

      if (!category) {
        throw new NotFoundException(
          `Категорію з ідентифікатором ${dto.newCategoryId} не знайдено`
        );
      }

      existingFood.category = category;
    }

    if (newImage) {
      await this.fileService.deleteFile(existingFood.image);

      const fileName = await this.fileService.createFile(newImage);
      existingFood.image = fileName;
    }

    existingFood.ingredients = [];

    if (dto.newIngredientsIds) {
      if (typeof dto.newIngredientsIds === "string") {
        const ingredient = await this.ingredientService.getIngredientById(
          dto.newIngredientsIds
        );

        if (!ingredient) {
          throw new NotFoundException(
            `Інгредієнт з ідентифікатором ${dto.newIngredientsIds} не знайдено`
          );
        }

        existingFood.ingredients.push(ingredient);
      } else {
        for (const ingredientId of dto.newIngredientsIds) {
          const ingredient =
            await this.ingredientService.getIngredientById(ingredientId);

          if (!ingredient) {
            throw new NotFoundException(
              `Інгредієнт з ідентифікатором ${ingredientId} не знайдено`
            );
          }

          existingFood.ingredients.push(ingredient);
        }
      }
    }

    await this.saveFood(existingFood);

    return existingFood;
  }

  public async saveFood(food: Food): Promise<Food> {
    return await this.foodRepository.save(food);
  }

  public async deleteFood(id: number): Promise<DeleteResult> {
    const food = await this.getFoodById(id);

    if (!food) {
      throw new NotFoundException(`Їжу з ідентифікатором ${id} не знайдено`);
    }

    await this.fileService.deleteFile(food.image);

    return await this.foodRepository.delete(id);
  }

  public async addIngredientToFood(
    foodId: number,
    ingredientId: number
  ): Promise<Food> {
    const food = await this.getFoodById(foodId);

    if (!food) {
      throw new NotFoundException(
        `Їжа з ідентифікатором ${foodId} не знайдено`
      );
    }

    const ingredient =
      await this.ingredientService.getIngredientById(ingredientId);

    if (!ingredient) {
      throw new NotFoundException(
        `Інгредієнт з ідентифікатором ${ingredientId} не знайдено`
      );
    }

    const ingredientExists = food.ingredients.some(
      (existingIngredient) => existingIngredient.id === ingredientId
    );

    if (ingredientExists) {
      throw new ConflictException(
        `Інгредієнт з ідентифікатором ${ingredientId} вже існує в їжі`
      );
    }

    food.ingredients.push(ingredient);

    return await this.saveFood(food);
  }

  public async deleteIngredientFromFood(
    foodId: number,
    ingredientId: number
  ): Promise<Food> {
    const food = await this.getFoodById(foodId);

    if (!food) {
      throw new NotFoundException(
        `Їжа з ідентифікатором ${foodId} не знайдено`
      );
    }

    const ingredientIndex = food.ingredients.findIndex(
      (existingIngredient) => existingIngredient.id === ingredientId
    );

    if (ingredientIndex === -1) {
      throw new NotFoundException(
        `Інгредієнт з ідентифікатором ${ingredientId} не знайдено у їжі`
      );
    }

    food.ingredients.splice(ingredientIndex, 1);

    return await this.saveFood(food);
  }

  public async getAllFoods(): Promise<Food[]> {
    return await this.foodRepository.find({
      relations: ["category", "ingredients"],
    });
  }

  public async getAllFoodsNames(): Promise<{ id: number; name: string }[]> {
    const foods = await this.foodRepository.find();

    return foods.map((food) => ({ id: food.id, name: food.name }));
  }

  public async getMostPopularFood(): Promise<Food> {
    const [mostPopularFood] = await this.foodRepository.find({
      order: {
        rating: "DESC",
      },
      take: 1,
      relations: ["category", "ingredients"],
    });
    return mostPopularFood;
  }

  public async getFoodsByCategoryName(categoryName: string): Promise<Food[]> {
    return await this.foodRepository.find({
      relations: ["category", "ingredients"],
      where: {
        category: {
          name: categoryName,
        },
      },
    });
  }

  public async getOneFood(id: number): Promise<Food> {
    const food = await this.getFoodById(id);

    if (!food) {
      throw new NotFoundException(`Їжу з ідентифікатором ${id} не знайдено`);
    }

    return food;
  }

  public async getFoodById(id: number): Promise<Food | null> {
    return await this.foodRepository.findOne({
      where: { id },
      relations: ["category", "ingredients"],
    });
  }

  public async getFoodsByIds(foodIds: number[]): Promise<Food[]> {
    const foods = await this.foodRepository.find({
      where: {
        id: In(foodIds),
      },
    });

    if (foods.length !== foodIds.length) {
      const foundIds = foods.map((food) => food.id);
      const notFoundIds = foodIds.filter((id) => !foundIds.includes(id));

      throw new NotFoundException(
        `Їжу з ідентифікаторами [${notFoundIds.join(", ")}] не знайдено`
      );
    }

    return foods;
  }

  public async getFoodByName(name: string): Promise<Food | null> {
    return await this.foodRepository.findOne({
      where: { name },
      relations: ["category", "ingredients"],
    });
  }
}
