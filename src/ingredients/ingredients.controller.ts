import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
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
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { IngredientsService } from "./ingredients.service";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { Ingredient } from "./ingredient.entity";
import { AdminGuard } from "src/guards/admin.guard";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "src/pipes/file.validation.pipe";
import { CustomUploadedFile } from "src/interfaces/CustomUploadedFile";

@ApiTags("Інгредієнти")
@Controller("ingredients")
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientsService) {}

  @ApiOperation({ summary: "Створити новий інгредієнт" })
  @ApiExtraModels()
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить інформацію про новий інгредієнт",
    schema: {
      allOf: [
        { $ref: getSchemaPath(CreateIngredientDto) },
        {
          type: "object",
          properties: {
            image: {
              type: "string",
              format: "binary",
              description: "Файл зображення інгредієнту",
              example: "ingredient-image.jpg",
            },
          },
          required: ["image"],
        },
      ],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Інгредієнт створено успішно",
    type: Ingredient,
  })
  @ApiBadRequestResponse({
    description:
      "Файл не надано, неправильне введення або непідтримуваний тип файлу",
  })
  @ApiInternalServerErrorResponse({
    description: "Виникла помилка під час запису файлу",
  })
  @ApiConflictResponse({ description: "Інгредієнт вже існує" })
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
    @Body() ingredientDto: CreateIngredientDto,
    @UploadedFile(FileValidationPipe) image: CustomUploadedFile
  ) {
    return this.ingredientService.createIngredient(ingredientDto, image);
  }

  @ApiOperation({ summary: "Оновлення існуючого інгредієнту" })
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить інформацію про інгредієнт, який потрібно оновити",
    schema: {
      allOf: [
        { $ref: getSchemaPath(UpdateIngredientDto) },
        {
          type: "object",
          properties: {
            image: {
              type: "string",
              format: "binary",
              description: "Файл зображення інгредієнту",
              example: "ingredient-image.jpg",
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Інгредієнт успішно оновлено",
    type: Ingredient,
  })
  @ApiBadRequestResponse({
    description: "Неправильне введення або непідтримуваний тип файлу",
  })
  @ApiInternalServerErrorResponse({
    description: "Виникла помилка під час видалення файлу або запису файлу",
  })
  @ApiNotFoundResponse({ description: "Інгредієнт або файл не знайдено" })
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
    @Body() ingredientDto: UpdateIngredientDto,
    @UploadedFile(FileValidationPipe) newImage: CustomUploadedFile
  ) {
    return this.ingredientService.updateIngredient(ingredientDto, newImage);
  }

  @ApiOperation({ summary: "Видалити існуючий інгредієнт" })
  @ApiQuery({
    name: "id",
    description: "Ідентифікатор інгредієнту, який потрібно видалити",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Інгредієнт успішно видалено",
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
  @ApiNotFoundResponse({ description: "Інгредієнт або файл не знайдено" })
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
    return this.ingredientService.deleteIngredient(id);
  }

  @ApiOperation({ summary: "Достати усі назви інгредієнтів" })
  @ApiResponse({
    status: 200,
    description: "Список усіх назв інгредієнтів",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "Унікальний ідентифікатор інгредієнта",
            example: 1,
          },
          title: {
            type: "string",
            description: "Назва інгредієнта",
            example: "Норі",
          },
        },
      },
    },
  })
  @Get("/titles")
  public async getAllTitles() {
    return this.ingredientService.getAllIngredientsTitles();
  }

  @ApiOperation({ summary: "Отримати всі інгредієнти" })
  @ApiResponse({
    status: 200,
    description: "Список усіх інгредієнтів",
    type: [Ingredient],
  })
  @Get()
  public async getAll() {
    return this.ingredientService.getAllIngredients();
  }
}
