import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { TraysFoodsService } from "./trays-foods.service";
import { AuthenticationGuard } from "src/authentications/authentication.guard";
import { AuthenticatedRequest } from "src/interfaces/AuthenticatedRequest";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { TrayFoodDto } from "./dto/tray-food.dto";
import { TrayFood } from "./tray-food.entity";
import { Food } from "src/foods/food.entity";

@ApiTags("Таці-Їжа")
@Controller("trays-foods")
export class TraysFoodsController {
  constructor(private readonly trayFoodService: TraysFoodsService) {}

  @ApiOperation({ summary: "Додати їжу до таці" })
  @ApiResponse({
    status: 200,
    description: "Їжу успішно додано до таці",
    type: TrayFood,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Їжу або тацю для користувача не знайдено",
  })
  @ApiConflictResponse({ description: "Їжа вже є у таці" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки зареєстровані користувачі можуть виконати цю дію",
  })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth("JWT-auth")
  @Post()
  public async addFoodToTray(
    @Body() trayFoodDto: TrayFoodDto,
    @Req() request: AuthenticatedRequest
  ) {
    const { user } = request;

    return this.trayFoodService.addFoodToTray(trayFoodDto.foodId, user);
  }

  @ApiOperation({ summary: "Видалити їжу з таці" })
  @ApiResponse({
    status: 200,
    description: "Їжу успішно видалено з таці",
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
    description:
      "Не знайдено їжу, тацю для користувача або їжу не знайдено у таці",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки зареєстровані користувачі можуть виконати цю дію",
  })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth("JWT-auth")
  @Delete()
  public async deleteFoodFromTray(
    @Body() trayFoodDto: TrayFoodDto,
    @Req() request: AuthenticatedRequest
  ) {
    const { user } = request;

    return this.trayFoodService.deleteFoodFromTray(trayFoodDto.foodId, user);
  }

  @ApiOperation({ summary: "Дістати їжу з таці" })
  @ApiQuery({
    type: Number,
    name: "trayId",
    description: "Ідентифікатор таці, з якого потрібно достати їжу",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Їжа успішно дісталася з таці",
    type: [Food],
  })
  @ApiBadRequestResponse({ description: "Ідентифікатор таці не був наданий" })
  @ApiNotFoundResponse({ description: "У таці не знайдено їжі" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки зареєстровані користувачі можуть виконати цю дію",
  })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth("JWT-auth")
  @Get()
  public async getFoodsFromTray(@Query("trayId") trayId: number) {
    return this.trayFoodService.getFoodsFromTray(trayId);
  }
}
