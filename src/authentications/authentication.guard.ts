import {
  CanActivate,
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthenticatedRequest } from "src/interfaces/AuthenticatedRequest";
import { TokensService } from "src/tokens/tokens.service";
import { Request } from "express";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly tokenService: TokensService) {}

  public canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Токен доступу не надано");
    }

    try {
      const userPayload = this.tokenService.validateAccessToken(token);

      request["user"] = userPayload;
    } catch {
      throw new UnauthorizedException("Неправильний токен доступу");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
