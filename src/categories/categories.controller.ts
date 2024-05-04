import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { AdminGuard } from "src/guards/admin.guard";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Category } from "./category.entity";

@ApiTags("Категорії")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @ApiOperation({ summary: "Створити нову категорію" })
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить інформацію про нову категорію",
    type: CreateCategoryDto,
  })
  @ApiResponse({
    status: 200,
    description: "Категорію створено успішно",
    type: Category,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiConflictResponse({ description: "Категорія вже існує" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Post()
  public async create(@Body() categoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(categoryDto);
  }

  @ApiOperation({ summary: "Оновлення існуючої категорії" })
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить інформацію про категорію, яку потрібно оновити",
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 200,
    description: "Категорію успішно оновлено",
    type: Category,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({ description: "Категорію не знайдено" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Put()
  public async update(@Body() categoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(categoryDto);
  }

  @ApiOperation({ summary: "Видалити існуючу категорію" })
  @ApiQuery({
    name: "id",
    description: "Ідентифікатор категорії, яку потрібно видалити",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Категорію успішно видалено",
    schema: {
      type: "object",
      properties: {
        raw: { type: "object" },
        affected: { type: "number", nullable: true },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({ description: "Категорію не знайдено" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Delete()
  public async delete(@Query("id") id: number) {
    return this.categoryService.deleteCategory(id);
  }

  @ApiOperation({ summary: "Отримати всі категорії" })
  @ApiResponse({
    status: 200,
    description: "Список усіх категорій",
    type: [Category],
  })
  @Get()
  public async getAll() {
    return this.categoryService.getAllCategories();
  }

  @ApiOperation({ summary: "Отримати категорію за ідентифікатором" })
  @ApiParam({
    name: "id",
    description: "Ідентифікатор категорії для отримання",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Категорія успішно знайдена",
    type: Category,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({ description: "Категорію не знайдено" })
  @Get("/:id")
  public async getOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.getOneCategory(id);
  }
}
