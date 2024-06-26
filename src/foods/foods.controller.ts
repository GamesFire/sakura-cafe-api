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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FoodsService } from "./foods.service";
import { AdminGuard } from "src/guards/admin.guard";
import { CreateFoodDto } from "./dto/create-food.dto";
import { UpdateFoodDto } from "./dto/update-food.dto";
import { CustomUploadedFile } from "src/interfaces/CustomUploadedFile";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "src/pipes/file.validation.pipe";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { Food } from "./food.entity";

@ApiTags("Їжа")
@Controller("foods")
export class FoodsController {
  constructor(private readonly foodService: FoodsService) {}

  @ApiOperation({ summary: "Створити нову їжу" })
  @ApiExtraModels(CreateFoodDto)
  @ApiBody({
    description: "Об'єкт передачі даних, що містить інформацію про нову їжу",
    schema: {
      allOf: [
        { $ref: getSchemaPath(CreateFoodDto) },
        {
          type: "object",
          properties: {
            image: {
              type: "string",
              format: "binary",
              description: "Файл зображення їжі",
              example: "food-image.jpg",
            },
          },
          required: ["image"],
        },
      ],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Успішно створена їжа",
    type: Food,
  })
  @ApiBadRequestResponse({
    description:
      "Файл не надано, неправильне введення або непідтримуваний тип файлу",
  })
  @ApiInternalServerErrorResponse({
    description: "Виникла помилка під час запису файлу",
  })
  @ApiConflictResponse({ description: "Їжа вже існує" })
  @ApiNotFoundResponse({ description: "Категорію або інгредієнт не знайдено" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image"))
  public async create(
    @Body() foodDto: CreateFoodDto,
    @UploadedFile(FileValidationPipe) image: CustomUploadedFile
  ) {
    return this.foodService.createFood(foodDto, image);
  }

  @ApiOperation({ summary: "Оновлення існуючої їжі" })
  @ApiExtraModels(UpdateFoodDto)
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить інформацію про їжу, яку потрібно оновити",
    schema: {
      allOf: [
        { $ref: getSchemaPath(UpdateFoodDto) },
        {
          type: "object",
          properties: {
            newImage: {
              type: "string",
              format: "binary",
              description: "Новий файл зображення їжі",
              example: "food-image.jpg",
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Їжу успішно оновлено",
    type: Food,
  })
  @ApiBadRequestResponse({
    description: "Неправильне введення або непідтримуваний тип файлу",
  })
  @ApiInternalServerErrorResponse({
    description: "Виникла помилка під час видалення файлу або запису файлу",
  })
  @ApiNotFoundResponse({
    description: "Їжу, категорію або інгредієнт не знайдено",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Put()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("newImage"))
  public async update(
    @Body() foodDto: UpdateFoodDto,
    @UploadedFile(FileValidationPipe) newImage?: CustomUploadedFile
  ) {
    return this.foodService.updateFood(foodDto, newImage);
  }

  @ApiOperation({ summary: "Видалити існуючу їжу" })
  @ApiQuery({
    name: "id",
    description: "Ідентифікатор їжі, який потрібно видалити",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Їжу успішно видалено",
    schema: {
      type: "object",
      properties: {
        raw: { type: "object" },
        affected: { type: "number", nullable: true },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiInternalServerErrorResponse({
    description: "Виникла помилка під час видалення файлу",
  })
  @ApiNotFoundResponse({
    description: "Їжу не знайдено",
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
  public async delete(@Query("id") id: number) {
    return this.foodService.deleteFood(id);
  }

  @ApiOperation({ summary: "Додати інгредієнт до їжі" })
  @ApiParam({
    name: "foodId",
    description: "Ідентифікатор їжі, для якої потрібно додати інгредієнт",
    example: 1,
    type: Number,
  })
  @ApiParam({
    name: "ingredientId",
    description: "Ідентифікатор інгредієнта, який потрібно додати до їжі",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Інгредієнт успішно додано до їжі",
    type: Food,
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
  @Post("/:foodId/ingredient/:ingredientId")
  public async addIngredientToFood(
    @Param("foodId", ParseIntPipe) foodId: number,
    @Param("ingredientId", ParseIntPipe) ingredientId: number
  ) {
    return this.foodService.addIngredientToFood(foodId, ingredientId);
  }

  @ApiOperation({ summary: "Видалити інгредієнт з їжі" })
  @ApiParam({
    name: "foodId",
    description: "Ідентифікатор їжі, для якої потрібно видалити інгредієнт",
    example: 1,
    type: Number,
  })
  @ApiParam({
    name: "ingredientId",
    description: "Ідентифікатор інгредієнта, який потрібно видалити з їжі",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Інгредієнт успішно видалено з їжі",
    type: Food,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Не знайдено їжу або інгредієнт не знайдено у їжі",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Delete("/:foodId/ingredient/:ingredientId")
  public async deleteIngredientFromFood(
    @Param("foodId", ParseIntPipe) foodId: number,
    @Param("ingredientId", ParseIntPipe) ingredientId: number
  ) {
    return this.foodService.deleteIngredientFromFood(foodId, ingredientId);
  }

  @ApiOperation({ summary: "Отримати всю їжу" })
  @ApiResponse({
    status: 200,
    description: "Список усієї їжі",
    type: [Food],
  })
  @Get("/")
  public async getAll() {
    return this.foodService.getAllFoods();
  }

  @ApiOperation({ summary: "Дістати найпопулярнішу їжу з усіх" })
  @ApiResponse({
    status: 200,
    description: "Найпопулярніша їжа з усіх",
    type: Food,
  })
  @Get("/most-popular")
  public async getMostPopular() {
    return this.foodService.getMostPopularFood();
  }

  @ApiOperation({ summary: "Дістати усі назви їжі" })
  @ApiResponse({
    status: 200,
    description: "Список усіх назв їжі",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "Унікальний ідентифікатор їжі",
            example: 1,
          },
          name: {
            type: "string",
            description: "Назва їжі",
            example: "Суші",
          },
        },
      },
    },
  })
  @Get("/names")
  public async getAllNames() {
    return this.foodService.getAllFoodsNames();
  }

  @ApiOperation({ summary: "Дістати їжу із категорії" })
  @ApiResponse({
    status: 200,
    description: "Список їжі із категорії",
    type: [Food],
  })
  @Get("/category")
  public async getByCategory(@Query("categoryName") categoryName: string) {
    const decodedCategoryName = decodeURIComponent(categoryName);

    return this.foodService.getFoodsByCategoryName(decodedCategoryName);
  }

  @ApiOperation({ summary: "Отримати їжу за унікальним ідентифікатором" })
  @ApiParam({
    name: "id",
    description: "Ідентифікатор їжі, яку потрібно отримати",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Їжу успішно знайдено",
    type: Food,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({ description: "Їжу не знайдено" })
  @Get("/:id")
  public async getOne(@Param("id", ParseIntPipe) id: number) {
    return this.foodService.getOneFood(id);
  }
}
