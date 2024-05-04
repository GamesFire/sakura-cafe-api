import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthenticatedRequest } from "src/interfaces/AuthenticatedRequest";
import { Request } from "express";
import { TokensService } from "src/tokens/tokens.service";
import { Role } from "src/users/user.entity";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly tokenService: TokensService) {}

  public canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException("Токен доступу не надається");
      }

      const userPayload = this.tokenService.validateAccessToken(token);

      request["user"] = userPayload;

      return userPayload.role === Role.ADMIN;
    } catch {
      throw new UnauthorizedException("Неправильний токен доступу");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
