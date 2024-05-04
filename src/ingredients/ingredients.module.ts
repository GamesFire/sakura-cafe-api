import { Module } from "@nestjs/common";
import { IngredientsController } from "./ingredients.controller";
import { IngredientsService } from "./ingredients.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ingredient } from "./ingredient.entity";
import { Food } from "src/foods/food.entity";
import { TokensModule } from "src/tokens/tokens.module";
import { FilesModule } from "src/files/files.module";

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [
    TypeOrmModule.forFeature([Ingredient, Food]),
    TokensModule,
    FilesModule,
  ],
  exports: [IngredientsService],
})
export class IngredientsModule {}
