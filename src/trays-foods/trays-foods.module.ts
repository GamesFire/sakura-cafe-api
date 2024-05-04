import { Module } from "@nestjs/common";
import { TraysFoodsController } from "./trays-foods.controller";
import { TraysFoodsService } from "./trays-foods.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrayFood } from "./tray-food.entity";
import { Tray } from "src/trays/tray.entity";
import { Food } from "src/foods/food.entity";
import { TokensModule } from "src/tokens/tokens.module";
import { TraysModule } from "src/trays/trays.module";
import { FoodsModule } from "src/foods/foods.module";

@Module({
  controllers: [TraysFoodsController],
  providers: [TraysFoodsService],
  imports: [
    TypeOrmModule.forFeature([TrayFood, Tray, Food]),
    TokensModule,
    TraysModule,
    FoodsModule,
  ],
  exports: [TraysFoodsService],
})
export class TraysFoodsModule {}
