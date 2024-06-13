import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { TraysService } from "./trays.service";
import { AuthenticationGuard } from "src/authentications/authentication.guard";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { AuthenticatedRequest } from "src/interfaces/AuthenticatedRequest";
import { Tray } from "./tray.entity";
import { TrayFoodDto } from "./dto/tray-food.dto";
import { Food } from "src/foods/food.entity";

@ApiTags("Таці")
@Controller("trays")
export class TraysController {
  constructor(private readonly trayService: TraysService) {}

  @ApiOperation({ summary: "Отримати останню тацю користувача" })
  @ApiResponse({
    status: 200,
    description: "Тацю успішно отримано",
    type: Tray,
  })
  @ApiNotFoundResponse({ description: "Тацю для користувача не знайдено" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки зареєстровані користувачі можуть виконати цю дію",
  })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth("JWT-auth")
  @Get("/own")
  public async getOne(@Req() request: AuthenticatedRequest) {
    const { user } = request;

    return this.trayService.getMostRecentUserTray(user.id);
  }

  @ApiOperation({ summary: "Додати їжу до таці" })
  @ApiExtraModels(TrayFoodDto)
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить інформацію про ідентифікатори їжі, які потрібно додати до таці користувача",
    schema: {
      allOf: [{ $ref: getSchemaPath(TrayFoodDto) }],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Їжу успішно додано до таці",
    type: Tray,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description:
      "Їжу, тацю для користувача не знайдено або їжу з ідентифікаторами не знайдено",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки зареєстровані користувачі можуть виконати цю дію",
  })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth("JWT-auth")
  @Post("/foods")
  public async addFoodToTray(
    @Body() trayFoodDto: TrayFoodDto,
    @Req() request: AuthenticatedRequest
  ) {
    const { user } = request;

    return this.trayService.addFoodsToTray(trayFoodDto.foodIds, user);
  }

  @ApiOperation({ summary: "Дістати їжу з найостаннішої таці користувача" })
  @ApiResponse({
    status: 200,
    description: "Їжа успішно дісталася з найостаннішої таці користувача",
    type: [Food],
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({ description: "У таці не знайдено їжі" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки зареєстровані користувачі можуть виконати цю дію",
  })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth("JWT-auth")
  @Get("/foods")
  public async getFoodsFromMostRecentTray(
    @Req() request: AuthenticatedRequest
  ) {
    const { user } = request;

    return this.trayService.getFoodsFromMostRecentTray(user);
  }
}
