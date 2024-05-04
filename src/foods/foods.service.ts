import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Food } from "./food.entity";
import { CategoriesService } from "src/categories/categories.service";
import { FilesService } from "src/files/files.service";
import { Repository, type DeleteResult } from "typeorm";
import { CreateFoodDto } from "./dto/create-food.dto";
import { UpdateFoodDto } from "./dto/update-food.dto";
import { CustomUploadedFile } from "src/interfaces/CustomUploadedFile";

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
    private readonly categoryService: CategoriesService,
    private readonly fileService: FilesService
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

  public async getAllFoodsNames(): Promise<{ id: number; name: string }[]> {
    const foods = await this.foodRepository.find();

    return foods.map((food) => ({ id: food.id, name: food.name }));
  }

  public async getAllFoods(): Promise<Food[]> {
    return await this.foodRepository.find({
      relations: ["category", "ingredients.ingredient"],
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
      relations: ["category", "ingredients.ingredient"],
    });
  }

  public async getFoodByName(name: string): Promise<Food | null> {
    return await this.foodRepository.findOne({
      where: { name },
      relations: ["category", "ingredients.ingredient"],
    });
  }
}
