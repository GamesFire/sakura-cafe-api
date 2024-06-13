import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";
import { Rating } from "./rating.entity";
import { UsersService } from "src/users/users.service";
import { FoodsService } from "src/foods/foods.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UserPayload } from "src/interfaces/AuthenticatedRequest";
import { Food } from "src/foods/food.entity";

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    private readonly userService: UsersService,
    private readonly foodService: FoodsService
  ) {}

  public async createRating(
    dto: CreateRatingDto,
    user: UserPayload
  ): Promise<Rating> {
    const userFromDatabase = await this.userService.getUserById(user.id);
    const food = await this.foodService.getFoodById(dto.foodId);

    if (!userFromDatabase) {
      throw new NotFoundException(
        `Користувача з ідентифікатором ${user.id} не знайдено`
      );
    }

    if (!food) {
      throw new NotFoundException(
        `Їжу з ідентифікатором ${dto.foodId} не знайдено`
      );
    }

    const existingRating = await this.ratingRepository.findOne({
      where: { user: userFromDatabase, food },
    });

    if (existingRating) {
      await this.ratingRepository.delete(existingRating.id);
    }

    const rating = new Rating();
    rating.rate = dto.rate;
    rating.user = userFromDatabase;
    rating.food = food;

    await this.saveRating(rating);

    let averageRating = await this.getAverageRating(food);

    if (!averageRating) {
      averageRating = 0;
    }

    food.rating = averageRating;

    await this.foodService.saveFood(food);

    return rating;
  }

  public async saveRating(rating: Rating): Promise<Rating> {
    return await this.ratingRepository.save(rating);
  }

  public async deleteRating(
    foodId: number,
    user: UserPayload
  ): Promise<DeleteResult> {
    const userFromDatabase = await this.userService.getUserById(user.id);
    const food = await this.foodService.getFoodById(foodId);

    if (!userFromDatabase) {
      throw new NotFoundException(
        `Користувача з ідентифікатором ${user.id} не знайдено`
      );
    }

    if (!food) {
      throw new NotFoundException(
        `Їжу з ідентифікатором ${foodId} не знайдено`
      );
    }

    const existingRating = await this.ratingRepository.findOne({
      where: { user: userFromDatabase, food },
    });

    if (!existingRating) {
      throw new NotFoundException(
        `Оцінку для їжі з ідентифікатором ${foodId} користувачем з ідентифікатором ${user.id} не знайдено`
      );
    }

    const deletedRating = await this.ratingRepository.delete(existingRating.id);
    let averageRating = await this.getAverageRating(food);

    if (!averageRating) {
      averageRating = 0;
    }

    food.rating = averageRating;

    await this.foodService.saveFood(food);

    return deletedRating;
  }

  public async getAllRatings(user: UserPayload): Promise<Rating[]> {
    const userFromDatabase = await this.userService.getUserById(user.id);

    if (!userFromDatabase) {
      throw new NotFoundException(
        `Користувача з ідентифікатором ${user.id} не знайдено`
      );
    }

    const allRatings = await this.ratingRepository.find({
      where: { user: userFromDatabase },
      relations: ["food"],
    });

    return allRatings;
  }

  public async getOneRating(
    foodId: number,
    user: UserPayload
  ): Promise<Rating> {
    const userFromDatabase = await this.userService.getUserById(user.id);

    if (!userFromDatabase) {
      throw new NotFoundException(
        `Користувача з ідентифікатором ${user.id} не знайдено`
      );
    }

    const food = await this.foodService.getFoodById(foodId);

    if (!food) {
      throw new NotFoundException(
        `Їжу з ідентифікатором ${foodId} не знайдено`
      );
    }

    const rating = await this.ratingRepository.findOne({
      where: { user: userFromDatabase, food },
    });

    if (!rating) {
      throw new NotFoundException(`Оцінку їжі користувача не знайдено`);
    }

    return rating;
  }

  public async getRatingById(id: number): Promise<Rating | null> {
    return await this.ratingRepository.findOneBy({ id });
  }

  public async getAverageRating(food: Food): Promise<number | null> {
    return await this.ratingRepository.average("rate", { food });
  }
}
