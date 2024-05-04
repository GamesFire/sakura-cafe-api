import { forwardRef, Module } from "@nestjs/common";
import { TraysService } from "./trays.service";
import { TraysController } from "./trays.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tray } from "./tray.entity";
import { User } from "src/users/user.entity";
import { UsersModule } from "src/users/users.module";
import { TrayFood } from "src/trays-foods/tray-food.entity";
import { TokensModule } from "src/tokens/tokens.module";

@Module({
  providers: [TraysService],
  controllers: [TraysController],
  imports: [
    TypeOrmModule.forFeature([Tray, User, TrayFood]),
    forwardRef(() => UsersModule),
    TokensModule,
  ],
  exports: [TraysService],
})
export class TraysModule {}
