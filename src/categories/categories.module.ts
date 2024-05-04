import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Food } from "src/foods/food.entity";
import { TokensModule } from "src/tokens/tokens.module";

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [TypeOrmModule.forFeature([Category, Food]), TokensModule],
  exports: [CategoriesService],
})
export class CategoriesModule {}
