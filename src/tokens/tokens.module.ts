import { Module } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { Token } from "./token.entity";

@Module({
  providers: [TokensService],
  imports: [
    TypeOrmModule.forFeature([
      Token,
      User,
    ]),
    JwtModule,
  ],
  exports: [TokensService],
})
export class TokensModule {}
