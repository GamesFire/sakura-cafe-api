import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { Tray } from "./tray.entity";

@Injectable()
export class TraysService {
  constructor(
    @InjectRepository(Tray)
    private readonly trayRepository: Repository<Tray>,
    private readonly userService: UsersService
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

    await this.trayRepository.save(tray);

    return tray;
  }

  public async getMostRecentUserTray(userId: number): Promise<Tray> {
    const userAllTrays = await this.getUserAllTrays(userId);

    if (userAllTrays.length === 0) {
      throw new NotFoundException(
        `Таця для користувача з ідентифікатором ${userId} не знайдено`
      );
    }

    const mostRecentUserTray = userAllTrays.reduce(
      (prevTray, currentTray) => {
        return prevTray.id > currentTray.id ? prevTray : currentTray;
      }
    );

    return mostRecentUserTray;
  }

  public async getUserAllTrays(userId: number): Promise<Tray[]> {
    return await this.trayRepository.find({
      where: { user: { id: userId } },
      relations: ["user"],
    });
  }
}
