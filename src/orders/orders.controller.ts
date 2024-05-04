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
import { OrdersService } from "./orders.service";
import { UserGuard } from "src/guards/user.guard";
import { AcceptRejectOrderDto } from "./dto/accept-reject-order.dto";
import { AuthenticatedRequest } from "src/interfaces/AuthenticatedRequest";
import { AdminGuard } from "src/guards/admin.guard";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Order, Status } from "./order.entity";
import generateOrderSchema from "./order.schema";

@ApiTags("Замовлення")
@Controller("orders")
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @ApiOperation({ summary: "Створити нове замовлення" })
  @ApiCreatedResponse({
    status: 200,
    description: "Замовлення успішно створено",
    type: Order,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Користувача або таця для користувача не знайдено",
  })
  @ApiConflictResponse({ description: "Замовлення вже має тацю" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки верифіковані користувачі можуть виконати цю дію",
  })
  @UseGuards(UserGuard)
  @ApiBearerAuth("JWT-auth")
  @Post()
  public async create(@Req() request: AuthenticatedRequest) {
    const { user } = request;

    return this.orderService.createOrder(user);
  }

  @ApiOperation({ summary: "Скасувати замовлення за ідентифікатором" })
  @ApiQuery({
    name: "orderId",
    description: "Ідентифікатор замовлення, яке потрібно скасувати",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Замовлення успішно скасовано",
    schema: generateOrderSchema(Status.CANCELED),
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Замовлення або таця користувача не знайдено",
  })
  @ApiConflictResponse({
    description: `Замовлення не може бути скасоване, якщо воно не перебуває в статусі "на розгляді" або не належить жодному з таць користувача`,
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
  public async cancel(
    @Query("orderId") orderId: number,
    @Req() request: AuthenticatedRequest
  ) {
    const { user } = request;

    return this.orderService.cancelOrder(orderId, user);
  }

  @ApiOperation({ summary: "Отримати всі власні замовлення користувача" })
  @ApiResponse({
    status: 200,
    description: "Список усіх власних замовлень користувача",
    type: [Order],
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Таця користувача не знайдена",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки верифіковані користувачі можуть виконати цю дію",
  })
  @UseGuards(UserGuard)
  @ApiBearerAuth("JWT-auth")
  @Get("/own")
  public async getOwnOrders(@Req() request: AuthenticatedRequest) {
    const { user } = request;

    return this.orderService.getOwnOrders(user);
  }

  @ApiOperation({ summary: "Отримати замовлення всіх користувачів" })
  @ApiResponse({
    status: 200,
    description: "Список всіх замовлень користувачів",
    type: [Order],
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки верифіковані користувачі можуть виконати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Get()
  public async getAll() {
    return this.orderService.getAllOrders();
  }

  @ApiOperation({ summary: "Прийняти замовлення" })
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить ідентифікатор замовлення для прийняття",
    type: AcceptRejectOrderDto,
  })
  @ApiResponse({
    status: 200,
    description: "Замовлення успішно прийнято",
    schema: generateOrderSchema(Status.ACCEPTED),
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Замовлення не знайдено",
  })
  @ApiConflictResponse({
    description: `Замовлення не може бути прийняте, оскільки воно не в статусі "на розгляді"`,
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Post("/accept")
  public async accept(@Body() orderDto: AcceptRejectOrderDto) {
    return this.orderService.acceptOrder(orderDto.orderId);
  }

  @ApiOperation({ summary: "Відхилити замовлення" })
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить ідентифікатор замовлення для відхилення",
    type: AcceptRejectOrderDto,
  })
  @ApiResponse({
    status: 200,
    description: "Замовлення успішно відхилено",
    schema: generateOrderSchema(Status.REJECTED),
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Замовлення не знайдено",
  })
  @ApiConflictResponse({
    description:
      "Замовлення не може бути відхилене, оскільки воно не перебуває в статусі PENDING",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Post("/reject")
  public async reject(@Body() orderDto: AcceptRejectOrderDto) {
    return this.orderService.rejectOrder(orderDto.orderId);
  }
}
