import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role, User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserPayload } from "src/interfaces/AuthenticatedRequest";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async createUser(dto: CreateUserDto): Promise<User> {
    const user = new User();

    user.name = dto.name;
    user.email = dto.email;
    user.password = dto.password;
    user.activationLink = dto.activationLink;

    await this.saveUser(user);

    return user;
  }

  public async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async addAdminRoleForUser(userId: number): Promise<UserPayload> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(
        `Користувача з ідентифікатором ${userId} не знайдено`
      );
    }

    if (user.role === Role.ADMIN) {
      throw new BadRequestException(
        `Користувач з ідентифікатором ${userId} вже є адміністратором`
      );
    }

    if (user.role === Role.GUEST) {
      throw new BadRequestException(
        `Користувач з ідентифікатором ${userId} ще не активований`
      );
    }

    user.role = Role.ADMIN;

    await this.saveUser(user);

    const userPayload = this.transformUserToUserPayload(user);

    return userPayload;
  }

  public async getAllUsers(): Promise<UserPayload[]> {
    const users = await this.userRepository.find();
    const usersPayload = users.map((user) =>
      this.transformUserToUserPayload(user)
    );

    return usersPayload;
  }

  public async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  public async getUserByActivationLink(
    activationLink: string
  ): Promise<User | null> {
    return await this.userRepository.findOneBy({ activationLink });
  }

  public transformUserToUserPayload(user: User): UserPayload {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
