import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository, DeleteResult } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  public async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.getCategoryByName(dto.name);

    if (existingCategory) {
      throw new ConflictException(`Категорія ${dto.name} вже існує`);
    }

    const category = new Category();
    category.name = dto.name;

    await this.saveCategory(category);

    return category;
  }

  public async updateCategory(dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getCategoryById(dto.id);

    if (!category) {
      throw new NotFoundException(
        `Категорію з ідентифікатором ${dto.id} не знайдено`
      );
    }

    category.name = dto.newName;

    await this.saveCategory(category);

    return category;
  }

  public async saveCategory(category: Category): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  public async deleteCategory(id: number): Promise<DeleteResult> {
    const category = await this.getCategoryById(id);

    if (!category) {
      throw new NotFoundException(
        `Категорію з ідентифікатором ${id} не знайдено`
      );
    }

    return await this.categoryRepository.delete(id);
  }

  public async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  public async getOneCategory(id: number): Promise<Category> {
    const category = await this.getCategoryById(id);

    if (!category) {
      throw new NotFoundException(
        `Категорію з ідентифікатором ${id} не знайдено`
      );
    }

    return category;
  }

  public async getCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id });
  }

  public async getCategoryByName(name: string): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ name });
  }
}
