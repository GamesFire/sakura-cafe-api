import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { TraysService } from "./trays.service";
import { AuthenticationGuard } from "src/authentications/authentication.guard";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthenticatedRequest } from "src/interfaces/AuthenticatedRequest";
import { Tray } from "./tray.entity";

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
  @Get()
  public async getOne(@Req() request: AuthenticatedRequest) {
    const { user } = request;

    return this.trayService.getMostRecentUserTray(user.id);
  }
}
