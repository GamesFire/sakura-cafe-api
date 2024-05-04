import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Token } from "src/tokens/token.entity";
import { AuthModule } from "src/authentications/authentications.module";
import { TokensModule } from "src/tokens/tokens.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    forwardRef(() => AuthModule),
    TokensModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
