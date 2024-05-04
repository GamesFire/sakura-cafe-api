import { Module } from "@nestjs/common";
import { FoodsService } from "./foods.service";
import { FoodsController } from "./foods.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Food } from "./food.entity";
import { Category } from "src/categories/category.entity";
import { FoodIngredient } from "src/foods-ingredients/food-ingredient.entity";
import { Ingredient } from "src/ingredients/ingredient.entity";
import { TokensModule } from "src/tokens/tokens.module";
import { CategoriesModule } from "src/categories/categories.module";
import { FilesModule } from "src/files/files.module";

@Module({
  providers: [FoodsService],
  controllers: [FoodsController],
  imports: [
    TypeOrmModule.forFeature([Food, Category, FoodIngredient, Ingredient]),
    TokensModule,
    CategoriesModule,
    FilesModule,
  ],
  exports: [FoodsService],
})
export class FoodsModule {}
