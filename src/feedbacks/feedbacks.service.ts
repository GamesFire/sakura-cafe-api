import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Feedback } from "./feedback.entity";
import { UsersService } from "src/users/users.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UserPayload } from "src/interfaces/AuthenticatedRequest";
import { ProcessedFeedbackDto } from "./dto/processed-feedback.dto";

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly userService: UsersService
  ) {}

  public async createFeedback(
    dto: CreateFeedbackDto,
    user: UserPayload
  ): Promise<Feedback> {
    const userFromDatabase = await this.userService.getUserById(user.id);

    if (!userFromDatabase) {
      throw new NotFoundException(
        `Користувача з ідентифікатором ${user.id} не знайдено`
      );
    }

    const feedback = new Feedback();
    feedback.subject = dto.subject;
    feedback.message = dto.message;
    feedback.date = new Date();
    feedback.isProcessed = false;
    feedback.user = userFromDatabase;

    return await this.saveFeedback(feedback);
  }

  public async saveFeedback(feedback: Feedback): Promise<Feedback> {
    return await this.feedbackRepository.save(feedback);
  }

  public async processedFeedback(dto: ProcessedFeedbackDto): Promise<Feedback> {
    const feedback = await this.getFeedbackById(dto.feedbackId);

    if (!feedback) {
      throw new NotFoundException(
        `Зворотний зв'язок з ідентифікатором ${dto.feedbackId} не знайдено`
      );
    }

    if (feedback.isProcessed) {
      throw new BadRequestException(
        `Зворотний зв'язок з ідентифікатором ${dto.feedbackId} вже є обробленим`
      );
    }

    feedback.isProcessed = true;

    return await this.saveFeedback(feedback);
  }

  public async getAllFeedbacks(): Promise<Feedback[]> {
    const allFeedbacks = await this.feedbackRepository.find({
      relations: ["user"],
    });

    return allFeedbacks.map((feedback) => {
      if (feedback.user) {
        (feedback.user as UserPayload) =
          this.userService.transformUserToUserPayload(feedback.user);
      }
      return feedback;
    });
  }

  public async getFeedbackById(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (feedback.user) {
      (feedback.user as UserPayload) =
        this.userService.transformUserToUserPayload(feedback.user);
    }

    return feedback;
  }
}
