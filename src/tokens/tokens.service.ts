import { User } from "src/users/user.entity";
import { Token } from "./token.entity";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService
  ) {}

  public generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActivated: user.isActivated,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: "15m",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public validateAccessToken(accessToken: string): User {
    try {
      return this.jwtService.verify<User>(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Неправильний токен доступу");
    }
  }

  public validateRefreshToken(refreshToken: string): User {
    try {
      return this.jwtService.verify<User>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Недійсний токен оновлення");
    }
  }

  public async saveToken(user: User, refreshToken: string): Promise<Token> {
    let token = await this.tokenRepository.findOne({
      where: { user },
      relations: ["user"],
    });

    if (token) {
      token.refreshToken = refreshToken;
    } else {
      token = new Token();
      token.refreshToken = refreshToken;
      token.user = user;
    }

    return await this.tokenRepository.save(token);
  }

  public async deleteToken(refreshToken: string): Promise<DeleteResult> {
    const token = await this.getTokenByRefreshToken(refreshToken);

    if (!token) {
      throw new NotFoundException(`Токен не знайдено`);
    }

    return await this.tokenRepository.delete(token.id);
  }

  public async getTokenByRefreshToken(
    refreshToken: string
  ): Promise<Token | null> {
    return await this.tokenRepository.findOneBy({ refreshToken });
  }
}
