import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthenticationsService } from "./authentications.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { ValidateUserDto } from "src/users/dto/validate-user.dto";
import { Response, Request } from "express";
import { AuthenticationGuard } from "./authentication.guard";
import type { UUID } from "crypto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import AuthenticationSchema from "./authentication.schema";

@ApiTags("Автентифікація")
@Controller("authentications")
export class AuthenticationsController {
  constructor(private readonly authenticationService: AuthenticationsService) {}

  private setCookie(response: Response, refreshToken: string): void {
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
  }

  @ApiOperation({ summary: "Реєстрація користувачів" })
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить реєстраційну інформацію користувача",
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: "Реєстрація пройшла успішно",
    schema: AuthenticationSchema,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiConflictResponse({
    description: "Користувач з таким e-mail вже існує",
  })
  @ApiNotFoundResponse({ description: "Користувача не знайдено" })
  @Post("/registration")
  public async registration(
    @Body() userDto: CreateUserDto,
    @Res() response: Response
  ) {
    const tokens = await this.authenticationService.registration(userDto);

    this.setCookie(response, tokens.refreshToken);

    return response.send(tokens);
  }

  @ApiOperation({ summary: "Вхід користувача в систему" })
  @ApiBody({
    description: "Об'єкт передачі даних, що містить дані для входу користувача",
    type: ValidateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: "Успішний вхід в систему",
    schema: AuthenticationSchema,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Користувача з таким e-mail не знайдено",
  })
  @ApiUnauthorizedResponse({ description: "Неправильний e-mail або пароль" })
  @Post("/login")
  public async login(
    @Body() userDto: ValidateUserDto,
    @Res() response: Response
  ) {
    const tokens = await this.authenticationService.login(userDto);

    this.setCookie(response, tokens.refreshToken);

    return response.send(tokens);
  }

  @ApiOperation({ summary: "Вихід користувача з системи" })
  @ApiResponse({
    status: 200,
    description: "Успішний вихід з системи",
    schema: {
      type: "object",
      properties: {
        raw: { type: "object" },
        affected: { type: "number", nullable: true },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({ description: "Токен не знайдено" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки зареєстровані користувачі можуть виконати цю дію",
  })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth("JWT-auth")
  @Post("/logout")
  public async logout(@Req() request: Request, @Res() response: Response) {
    const { refreshToken } = request.cookies;
    const token = await this.authenticationService.logout(refreshToken);

    response.clearCookie("refreshToken");

    return response.send(token);
  }

  @ApiOperation({ summary: "Активувати обліковий запис користувача" })
  @ApiParam({
    name: "link",
    description: "Посилання для активації облікового запису користувача",
    example: "b9aa533e-0e87-4554-b8b1-b7819b9e0949",
    type: String,
  })
  @ApiResponse({
    status: 302,
    description: "Перенаправлення на URL-адресу клієнта",
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Неправильне або прострочене посилання для активації",
  })
  @ApiInternalServerErrorResponse({
    description: "Не вдалося активувати користувача",
  })
  @Get("/activate/:link")
  public async activate(
    @Param("link") link: string | UUID,
    @Res() response: Response
  ) {
    const activationLink = link;

    await this.authenticationService.activate(activationLink);

    return response.redirect(process.env.CLIENT_URL);
  }

  @ApiOperation({ summary: "Оновити токени доступу" })
  @ApiResponse({
    status: 200,
    description: "Токени успішно оновлено",
    schema: AuthenticationSchema,
  })
  @ApiNotFoundResponse({ description: "Користувача не знайдено" })
  @ApiUnauthorizedResponse({
    description: "Токен оновлення не надано або він недійсний",
  })
  @Get("/refresh")
  public async refresh(@Req() request: Request, @Res() response: Response) {
    const { refreshToken } = request.cookies;
    const tokens = await this.authenticationService.refresh(refreshToken);

    this.setCookie(response, tokens.refreshToken);

    return response.send(tokens);
  }
}
