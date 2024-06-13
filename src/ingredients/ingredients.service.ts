import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ingredient } from "./ingredient.entity";
import { Repository, type DeleteResult } from "typeorm";
import { FilesService } from "src/files/files.service";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { CustomUploadedFile } from "src/interfaces/CustomUploadedFile";

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    private readonly fileService: FilesService
  ) {}

  public async createIngredient(
    dto: CreateIngredientDto,
    image: CustomUploadedFile
  ): Promise<Ingredient> {
    const existingIngredient = await this.getIngredientByTitle(dto.title);

    if (existingIngredient) {
      throw new ConflictException(`Інгредієнт ${dto.title} вже існує`);
    }

    const fileName = await this.fileService.createFile(image);
    const ingredient = new Ingredient();
    ingredient.title = dto.title;
    ingredient.image = fileName;

    await this.saveIngredient(ingredient);

    return ingredient;
  }

  public async updateIngredient(
    dto: UpdateIngredientDto,
    newImage?: CustomUploadedFile
  ): Promise<Ingredient> {
    const existingIngredient = await this.getIngredientById(dto.id);

    if (!existingIngredient) {
      throw new NotFoundException(
        `Інгредієнт з ідентифікатором ${dto.id} не знайдено`
      );
    }

    existingIngredient.title = dto.newTitle ?? existingIngredient.title;

    if (newImage) {
      await this.fileService.deleteFile(existingIngredient.image);

      const fileName = await this.fileService.createFile(newImage);
      existingIngredient.image = fileName;
    }

    await this.saveIngredient(existingIngredient);

    return existingIngredient;
  }

  public async saveIngredient(ingredient: Ingredient): Promise<Ingredient> {
    return await this.ingredientRepository.save(ingredient);
  }

  public async deleteIngredient(id: number): Promise<DeleteResult> {
    const ingredient = await this.ingredientRepository.findOne({
      where: { id },
      relations: ["foods"],
    });

    if (!ingredient) {
      throw new NotFoundException(
        `Інгредієнт з ідентифікатором ${id} не знайдено`
      );
    }

    if (ingredient.foods.length > 0) {
      const foodNames = ingredient.foods.map((food) => food.name).join(", ");
      throw new ConflictException(
        `Інгредієнт використовується в наступній їжу: ${foodNames}`
      );
    }

    await this.fileService.deleteFile(ingredient.image);

    return await this.ingredientRepository.delete(id);
  }

  public async getAllIngredientsTitles(): Promise<
    { id: number; title: string }[]
  > {
    const ingredients = await this.ingredientRepository.find();

    return ingredients.map((ingredient) => ({
      id: ingredient.id,
      title: ingredient.title,
    }));
  }

  public async getAllIngredients(): Promise<Ingredient[]> {
    return await this.ingredientRepository.find();
  }

  public async getIngredientById(id: number): Promise<Ingredient | null> {
    return this.ingredientRepository.findOneBy({ id });
  }

  public async getIngredientByTitle(title: string): Promise<Ingredient | null> {
    return await this.ingredientRepository.findOneBy({ title });
  }
}
