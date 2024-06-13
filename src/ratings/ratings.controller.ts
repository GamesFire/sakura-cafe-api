import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { RatingsService } from "./ratings.service";
import { UserGuard } from "src/guards/user.guard";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { AuthenticatedRequest } from "src/interfaces/AuthenticatedRequest";
import { Rating } from "./rating.entity";

@ApiTags("Рейтинг")
@Controller("rating")
export class RatingsController {
  constructor(private readonly ratingService: RatingsService) {}

  @ApiOperation({ summary: "Створити новий рейтинг" })
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить інформацію про рейтинг, включаючи ціну та ідентифікатор їжі",
    type: CreateRatingDto,
  })
  @ApiResponse({
    status: 200,
    description: "Рейтинг створено успішно",
    type: Rating,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Користувача або їжу не знайдено",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки верифіковані користувачі можуть виконати цю дію",
  })
  @UseGuards(UserGuard)
  @ApiBearerAuth("JWT-auth")
  @Post()
  public async create(
    @Body() ratingDto: CreateRatingDto,
    @Req() request: AuthenticatedRequest
  ) {
    const { user } = request;

    return this.ratingService.createRating(ratingDto, user);
  }

  @ApiOperation({ summary: "Видалити рейтинг за ідентифікатором їжі" })
  @ApiQuery({
    name: "foodId",
    description: "Ідентифікатор їжі, для якого слід видалити рейтинг",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Рейтинг успішно видалено",
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
    description: "Користувач, їжа або оцінка їжі користувачем не знайдені",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки верифіковані користувачі можуть виконати цю дію",
  })
  @UseGuards(UserGuard)
  @ApiBearerAuth("JWT-auth")
  @Delete()
  public async delete(
    @Query("foodId")
    foodId: number,
    @Req() request: AuthenticatedRequest
  ) {
    const { user } = request;

    return this.ratingService.deleteRating(foodId, user);
  }

  @ApiOperation({ summary: "Отримати всі оцінки користувача" })
  @ApiResponse({
    status: 200,
    description: "Список всіх оцінок користувача",
    type: [Rating],
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Користувача не знайдено",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки верифіковані користувачі можуть виконати цю дію",
  })
  @UseGuards(UserGuard)
  @ApiBearerAuth("JWT-auth")
  @Get()
  public async getAll(@Req() request: AuthenticatedRequest) {
    const { user } = request;

    return this.ratingService.getAllRatings(user);
  }

  @ApiOperation({
    summary: "Отримати оцінку користувача їжі за унікальним ідентифікатором",
  })
  @ApiParam({
    name: "foodId",
    description:
      "Ідентифікатор їжі, для якої потрібно отримати оцінку користувача",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Оцінку користувача їжі успішно знайдено",
    type: Rating,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Користувача, їжу або оцінку їжі користувача не знайдено",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки верифіковані користувачі можуть виконати цю дію",
  })
  @UseGuards(UserGuard)
  @ApiBearerAuth("JWT-auth")
  @Get("/:foodId")
  public async getOne(
    @Param("foodId", ParseIntPipe) foodId: number,
    @Req() request: AuthenticatedRequest
  ) {
    const { user } = request;

    return this.ratingService.getOneRating(foodId, user);
  }
}
