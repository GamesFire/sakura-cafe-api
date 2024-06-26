import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order, Status } from "./order.entity";
import { Repository } from "typeorm";
import { TraysService } from "src/trays/trays.service";
import { UsersService } from "src/users/users.service";
import { UserPayload } from "src/interfaces/AuthenticatedRequest";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly trayService: TraysService,
    private readonly userService: UsersService
  ) {}

  private async getMostRecentOrder(userId: number): Promise<Order | undefined> {
    return this.orderRepository.findOne({
      where: { tray: { user: { id: userId } } },
      order: { date: "DESC" },
      relations: ["tray", "tray.user"],
    });
  }

  public async createOrder(user: UserPayload): Promise<Order> {
    const recentOrder = await this.getMostRecentOrder(user.id);
    const userTray = await this.trayService.getMostRecentUserTray(user.id);

    if (recentOrder && recentOrder.status === Status.PENDING) {
      throw new ConflictException(
        `Ваше останнє замовлення №${recentOrder.id} ще обробляється. Ви не можете створити нове замовлення, поки попереднє не буде оброблено.`
      );
    }

    if (await this.getOrderByTrayId(userTray.id)) {
      throw new ConflictException(
        `Для таці з ідентифікатором ${userTray.id} вже існує замовлення`
      );
    }

    const order = new Order();
    order.status = Status.PENDING;
    order.date = new Date();
    order.tray = userTray;

    await this.saveOrder(order);
    await this.trayService.createTray(user.id);

    return order;
  }

  public async saveOrder(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }

  public async getOwnOrders(user: UserPayload): Promise<Order[]> {
    const userAllTrays = await this.trayService.getUserAllTrays(user.id);

    if (userAllTrays.length === 0) {
      throw new NotFoundException(
        `Таця для користувача з ідентифікатором ${user.id} не знайдено`
      );
    }

    const trayIds = userAllTrays.map((tray) => tray.id);

    let userOrders: Order[] = [];

    for (let i = 0; i < trayIds.length; i++) {
      const order = await this.orderRepository.findOne({
        where: { tray: { id: trayIds[i] } },
        relations: ["tray", "tray.foods", "tray.foods.ingredients"],
      });

      if (order) {
        userOrders.push(order);
      }
    }

    return userOrders;
  }

  public async getAllOrders(): Promise<Order[]> {
    const allOrders = await this.orderRepository.find({
      relations: ["tray", "tray.user", "tray.foods", "tray.foods.ingredients"],
    });

    return allOrders.map((order) => {
      if (order.tray && order.tray.user) {
        (order.tray.user as UserPayload) =
          this.userService.transformUserToUserPayload(order.tray.user);
      }
      return order;
    });
  }

  public async cancelOrder(id: number, user: UserPayload): Promise<Order> {
    const order = await this.getOrderById(id);

    if (!order) {
      throw new NotFoundException(
        `Замовлення з ідентифікатором ${id} не знайдено`
      );
    }

    if (order.status !== Status.PENDING) {
      throw new ConflictException(
        `Замовлення з ідентифікатором ${id} не може бути скасоване, оскільки воно не перебуває в статусі "на розгляді"`
      );
    }

    const userAllTrays = await this.trayService.getUserAllTrays(user.id);

    if (userAllTrays.length === 0) {
      throw new NotFoundException(
        `Таця для користувача з ідентифікатором ${user.id} не знайдено`
      );
    }

    if (!userAllTrays.some((tray) => tray.id === order.tray.id)) {
      throw new ConflictException(
        `Замовлення з ідентифікатором ${id} не належить жодному з ваших таць`
      );
    }

    order.status = Status.CANCELED;

    await this.saveOrder(order);

    return order;
  }

  public async acceptOrder(orderId: number): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException(
        `Замовлення з ідентифікатором ${orderId} не знайдено`
      );
    }

    if (order.status !== Status.PENDING) {
      throw new ConflictException(
        `Замовлення з ідентифікатором ${orderId} не може бути прийняте, оскільки воно не в статусі "на розгляді"`
      );
    }

    order.status = Status.ACCEPTED;

    await this.saveOrder(order);

    return order;
  }

  public async rejectOrder(orderId: number): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException(
        `Замовлення з ідентифікатором ${orderId} не знайдено`
      );
    }

    if (order.status !== Status.PENDING) {
      throw new ConflictException(
        `Замовлення з ідентифікатором ${orderId} не може бути відхилене, оскільки воно не перебуває в статусі "на розгляді"`
      );
    }

    order.status = Status.REJECTED;

    await this.saveOrder(order);

    return order;
  }

  public async getOrderById(id: number): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ["tray", "tray.user", "tray.foods", "tray.foods.ingredients"],
    });
  }

  public async getOrderByTrayId(trayId: number): Promise<Order | null> {
    return await this.orderRepository.findOneBy({ tray: { id: trayId } });
  }
}
