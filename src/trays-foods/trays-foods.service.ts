import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TrayFood } from "./tray-food.entity";
import { FoodsService } from "src/foods/foods.service";
import { TraysService } from "src/trays/trays.service";
import { Repository, DeleteResult } from "typeorm";
import { UserPayload } from "src/interfaces/AuthenticatedRequest";
import { Food } from "src/foods/food.entity";

@Injectable()
export class TraysFoodsService {
  constructor(
    @InjectRepository(TrayFood)
    private readonly trayFoodRepository: Repository<TrayFood>,
    private readonly foodService: FoodsService,
    private readonly trayService: TraysService
  ) {}

  public async addFoodToTray(
    foodId: number,
    user: UserPayload
  ): Promise<TrayFood> {
    const food = await this.foodService.getFoodById(foodId);

    if (!food) {
      throw new NotFoundException(
        `Їжа з ідентифікатором ${foodId} не знайдено`
      );
    }

    const userTray = await this.trayService.getMostRecentUserTray(user.id);
    const existingTrayFood = await this.trayFoodRepository.findOneBy({
      tray: userTray,
      food,
    });

    if (existingTrayFood) {
      throw new ConflictException(
        `Їжа з ідентифікатором ${foodId} вже існує у таці`
      );
    }

    const trayFood = new TrayFood();
    trayFood.tray = userTray;
    trayFood.food = food;

    await this.trayFoodRepository.save(trayFood);

    return trayFood;
  }

  public async deleteFoodFromTray(
    foodId: number,
    user: UserPayload
  ): Promise<DeleteResult> {
    const food = await this.foodService.getFoodById(foodId);

    if (!food) {
      throw new NotFoundException(
        `Їжа з ідентифікатором ${foodId} не знайдено`
      );
    }

    const userTray = await this.trayService.getMostRecentUserTray(user.id);
    const trayFood = await this.trayFoodRepository.findOne({
      where: { tray: userTray, food },
    });

    if (!trayFood) {
      throw new NotFoundException(
        `Їжу з ідентифікатором ${foodId} не знайдено у таці`
      );
    }

    return await this.trayFoodRepository.delete(trayFood.id);
  }

  public async getFoodsFromTray(trayId: number): Promise<Food[]> {
    if (!trayId) {
      throw new BadRequestException("Ідентифікатор таці не був наданий");
    }

    const trayFoods = await this.trayFoodRepository.find({
      where: { tray: { id: trayId } },
      relations: ["food"],
    });

    if (trayFoods.length === 0) {
      throw new NotFoundException(
        `У таці з ідентифікатором ${trayId} не знайдено їжі`
      );
    }

    const foods = trayFoods.map((trayFood) => trayFood.food);

    return foods;
  }
}
