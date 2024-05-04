import { Module } from "@nestjs/common";
import { RatingsService } from "./ratings.service";
import { RatingsController } from "./ratings.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rating } from "./rating.entity";
import { User } from "src/users/user.entity";
import { Food } from "src/foods/food.entity";
import { TokensModule } from "src/tokens/tokens.module";
import { UsersModule } from "src/users/users.module";
import { FoodsModule } from "src/foods/foods.module";

@Module({
  providers: [RatingsService],
  controllers: [RatingsController],
  imports: [
    TypeOrmModule.forFeature([Rating, User, Food]),
    TokensModule,
    UsersModule,
    FoodsModule,
  ],
  exports: [RatingsService],
})
export class RatingModule {}
