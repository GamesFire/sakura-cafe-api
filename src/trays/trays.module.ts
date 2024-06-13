import { forwardRef, Module } from "@nestjs/common";
import { TraysService } from "./trays.service";
import { TraysController } from "./trays.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tray } from "./tray.entity";
import { User } from "src/users/user.entity";
import { Food } from "src/foods/food.entity";
import { UsersModule } from "src/users/users.module";
import { TokensModule } from "src/tokens/tokens.module";
import { FoodsModule } from "src/foods/foods.module";

@Module({
  providers: [TraysService],
  controllers: [TraysController],
  imports: [
    TypeOrmModule.forFeature([Tray, User, Food]),
    forwardRef(() => UsersModule),
    TokensModule,
    FoodsModule,
  ],
  exports: [TraysService],
})
export class TraysModule {}
