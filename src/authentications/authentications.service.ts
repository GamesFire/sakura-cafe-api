import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { ValidateUserDto } from "src/users/dto/validate-user.dto";
import { Role, User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { TokensService } from "src/tokens/tokens.service";
import { MailsService } from "src/mails/mails.service";
import { TraysService } from "src/trays/trays.service";
import { DeleteResult } from "typeorm";
import type { UUID } from "crypto";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokensService,
    private readonly mailService: MailsService,
    private readonly trayService: TraysService
  ) {}

  public async validateUser(userDto: ValidateUserDto): Promise<User> {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (!user) {
      throw new NotFoundException(
        `Користувача з e-mail ${userDto.email} не знайдено`
      );
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password
    );

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException("Неправильний e-mail або пароль");
  }

  public async registration(
    userDto: CreateUserDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new ConflictException("Користувач з таким e-mail вже існує");
    }

    const hashPassword = await bcrypt.hash(userDto.password, 10);
    const activationLink = uuid.v4() as UUID;
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
      activationLink,
    });

    await this.mailService.sendActivationMail(
      user.email,
      `${process.env.API_URL}/api/authentications/activate/${activationLink}`
    );

    const tokens = this.tokenService.generateTokens(user);

    await this.tokenService.saveToken(user, tokens.refreshToken);
    await this.trayService.createTray(user.id);

    return tokens;
  }

  public async login(
    userDto: ValidateUserDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(userDto);
    const tokens = this.tokenService.generateTokens(user);

    await this.tokenService.saveToken(user, tokens.refreshToken);

    return tokens;
  }

  public async logout(refreshToken: string): Promise<DeleteResult> {
    const token = await this.tokenService.deleteToken(refreshToken);

    return token;
  }

  public async activate(activationLink: string | UUID): Promise<void> {
    const user = await this.userService.getUserByActivationLink(activationLink);

    if (!user) {
      throw new NotFoundException(
        "Неправильне або прострочене посилання для активації"
      );
    }

    try {
      user.isActivated = true;
      user.role = Role.USER;

      await this.userService.saveUser(user);
    } catch {
      throw new InternalServerErrorException(
        "Не вдалося активувати користувача"
      );
    }
  }

  public async refresh(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException("Токен оновлення не наданий");
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDatabase =
      await this.tokenService.getTokenByRefreshToken(refreshToken);

    if (!userData || !tokenFromDatabase) {
      throw new UnauthorizedException("Недійсний токен оновлення");
    }

    const user = await this.userService.getUserById(userData.id);

    if (!user) {
      throw new NotFoundException(
        `Користувача з ідентифікатором ${userData.id} не знайдено`
      );
    }

    const tokens = this.tokenService.generateTokens(user);

    await this.tokenService.saveToken(user, tokens.refreshToken);

    return tokens;
  }
}
