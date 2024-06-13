import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AdminGuard } from "src/guards/admin.guard";
import { AddAdminRoleUserDto } from "./dto/add-admin-role-user.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
  getSchemaPath,
} from "@nestjs/swagger";
import { UserPayloadDto } from "./dto/user-payload.dto";

@ApiTags("Користувачі")
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: "Додати роль адміністратора користувачеві" })
  @ApiExtraModels(UserPayloadDto)
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить ідентифікатор користувача, якому буде додано роль адміністратора",
    type: AddAdminRoleUserDto,
  })
  @ApiResponse({
    status: 200,
    description: "Роль адміністратора успішно додано",
    schema: {
      allOf: [
        { $ref: getSchemaPath(UserPayloadDto) },
        {
          type: "object",
          properties: {
            role: {
              type: "string",
              description: "Роль користувача",
              example: "admin",
            },
          },
          required: ["role"],
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      "Неправильне введення, користувач вже є адміністратором або користувач ще не активований",
  })
  @ApiNotFoundResponse({ description: "Користувача не знайдено" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Patch("/add-admin")
  public async addAdminRole(@Body() userDto: AddAdminRoleUserDto) {
    return this.userService.addAdminRoleForUser(userDto.userId);
  }

  @ApiOperation({ summary: "Отримати всіх користувачів" })
  @ApiExtraModels(UserPayloadDto)
  @ApiResponse({
    status: 200,
    description: "Список усіх користувачів",
    type: [UserPayloadDto],
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Get()
  public async getAll() {
    return this.userService.getAllUsers();
  }
}
