import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AdminGuard } from "src/guards/admin.guard";
import { AddAdminRoleUserDto } from "./dto/add-admin-role-user.dto";
import { User } from "./user.entity";
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
} from "@nestjs/swagger";

@ApiTags("Користувачі")
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: "Додати роль адміністратора користувачеві" })
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить ідентифікатор користувача, якому буде додано роль адміністратора",
    type: AddAdminRoleUserDto,
  })
  @ApiResponse({
    status: 200,
    description: "Роль адміністратора успішно додано",
    type: User,
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
  @Post()
  public async addAdminRole(@Body() userDto: AddAdminRoleUserDto) {
    return this.userService.addAdminRoleForUser(userDto.userId);
  }

  @ApiOperation({ summary: "Отримати всіх користувачів" })
  @ApiResponse({
    status: 200,
    description: "Список усіх користувачів",
    type: [User],
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
