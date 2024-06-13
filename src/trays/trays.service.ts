import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { Tray } from "./tray.entity";
import { UserPayload } from "src/interfaces/AuthenticatedRequest";
import { FoodsService } from "src/foods/foods.service";
import { Food } from "src/foods/food.entity";

@Injectable()
export class TraysService {
  constructor(
    @InjectRepository(Tray)
    private readonly trayRepository: Repository<Tray>,
    private readonly userService: UsersService,
    private readonly foodService: FoodsService
  ) {}

  public async createTray(userId: number): Promise<Tray> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException(
        `Користувача з ідентифікатором ${userId} не знайдено`
      );
    }

    const tray = new Tray();
    tray.user = user;
    tray.foods = [];

    await this.saveTray(tray);

    return tray;
  }

  public async saveTray(tray: Tray): Promise<Tray> {
    return await this.trayRepository.save(tray);
  }

  public async addFoodsToTray(
    foodIds: number[],
    user: UserPayload
  ): Promise<Tray> {
    const foods = await this.foodService.getFoodsByIds(foodIds);
    const userTray = await this.getMostRecentUserTray(user.id);
    const existingFoodIds = userTray.foods.map((food) => food.id);
    const newFoodsToAdd = foods.filter(
      (food) => !existingFoodIds.includes(food.id)
    );

    userTray.foods.push(...newFoodsToAdd);

    userTray.foods = userTray.foods.filter((food) => foodIds.includes(food.id));

    await this.saveTray(userTray);

    return userTray;
  }

  public async getMostRecentUserTray(userId: number): Promise<Tray> {
    const userAllTrays = await this.getUserAllTrays(userId);

    if (userAllTrays.length === 0) {
      throw new NotFoundException(
        `Таця для користувача з ідентифікатором ${userId} не знайдено`
      );
    }

    const mostRecentUserTray = userAllTrays.reduce((prevTray, currentTray) => {
      return prevTray.id > currentTray.id ? prevTray : currentTray;
    });

    return mostRecentUserTray;
  }

  public async getUserAllTrays(userId: number): Promise<Tray[]> {
    return await this.trayRepository.find({
      where: { user: { id: userId } },
      relations: ["user", "foods"],
    });
  }

  public async getFoodsFromMostRecentTray(user: UserPayload): Promise<Food[]> {
    const userTray = await this.getMostRecentUserTray(user.id);
    const foods = userTray.foods;

    return foods;
  }
}
