import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FeedbacksService } from "./feedbacks.service";
import { Feedback } from "./feedback.entity";
import { AuthenticationGuard } from "src/authentications/authentication.guard";
import { AuthenticatedRequest } from "src/interfaces/AuthenticatedRequest";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { AdminGuard } from "src/guards/admin.guard";
import { ProcessedFeedbackDto } from "./dto/processed-feedback.dto";

@ApiTags("Зворотні зв'язки")
@Controller("feedbacks")
export class FeedbacksController {
  constructor(private readonly feedbackService: FeedbacksService) {}

  @ApiOperation({ summary: "Створити новий зворотний зв'язок" })
  @ApiCreatedResponse({
    status: 200,
    description: "Зворотний зв'язок успішно створено",
    type: Feedback,
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
  @ApiNotFoundResponse({
    description: "Користувача не знайдено",
  })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки зареєстровані користувачі можуть виконати цю дію",
  })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth("JWT-auth")
  @Post()
  public async create(
    @Body() feedbackDto: CreateFeedbackDto,
    @Req() request: AuthenticatedRequest
  ) {
    const { user } = request;

    return this.feedbackService.createFeedback(feedbackDto, user);
  }

  @ApiOperation({ summary: "Відмітити зворотний зв'язок, як оброблений" })
  @ApiExtraModels(ProcessedFeedbackDto)
  @ApiBody({
    description:
      "Об'єкт передачі даних, що містить ідентифікатор зворотного зв'язку, який потрібно відмітити, як оброблений",
    type: ProcessedFeedbackDto,
  })
  @ApiResponse({
    status: 200,
    description: "Зворотний зв'язок успішно відмічено, як оброблений",
    type: Feedback,
  })
  @ApiBadRequestResponse({
    description: "Неправильне введення або зворотний зв'язок вже є обробленим",
  })
  @ApiNotFoundResponse({ description: "Зворотного зв'язку не знайдено" })
  @ApiUnauthorizedResponse({
    description: "Токен доступу не надано або він недійсний",
  })
  @ApiForbiddenResponse({
    description: "Тільки адміністратори можуть виконувати цю дію",
  })
  @UseGuards(AdminGuard)
  @ApiBearerAuth("JWT-auth")
  @Patch("/processed")
  public async processed(@Body() feedbackDto: ProcessedFeedbackDto) {
    return this.feedbackService.processedFeedback(feedbackDto);
  }

  @ApiOperation({ summary: "Отримати всі зворотні зв'язки" })
  @ApiResponse({
    status: 200,
    description: "Список всіх зворотних зв'язків",
    type: [Feedback],
  })
  @ApiBadRequestResponse({ description: "Неправильне введення" })
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
    return this.feedbackService.getAllFeedbacks();
  }
}
