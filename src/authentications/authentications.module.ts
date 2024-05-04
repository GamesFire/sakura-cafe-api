import { forwardRef, Module } from "@nestjs/common";
import { AuthenticationsController } from "./authentications.controller";
import { AuthenticationsService } from "./authentications.service";
import { Token } from "src/tokens/token.entity";
import { User } from "src/users/user.entity";
import { Tray } from "src/trays/tray.entity";
import { UsersModule } from "src/users/users.module";
import { TokensModule } from "src/tokens/tokens.module";
import { MailModule } from "src/mails/mails.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TraysModule } from "src/trays/trays.module";

@Module({
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService],
  imports: [
    TypeOrmModule.forFeature([Token, User, Tray]),
    forwardRef(() => UsersModule),
    MailModule,
    TokensModule,
    TraysModule,
  ],
  exports: [AuthenticationsService],
})
export class AuthModule {}
