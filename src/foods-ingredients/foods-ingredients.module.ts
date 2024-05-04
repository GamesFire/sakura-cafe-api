import { Module } from '@nestjs/common';
import { FoodsIngredientsController } from './foods-ingredients.controller';
import { FoodsIngredientsService } from './foods-ingredients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodIngredient } from './food-ingredient.entity';
import { Food } from 'src/foods/food.entity';
import { Ingredient } from 'src/ingredients/ingredient.entity';
import { TokensModule } from 'src/tokens/tokens.module';
import { FoodsModule } from 'src/foods/foods.module';
import { IngredientsModule } from 'src/ingredients/ingredients.module';

@Module({
  controllers: [FoodsIngredientsController],
  providers: [FoodsIngredientsService],
  imports: [
    TypeOrmModule.forFeature([FoodIngredient, Food, Ingredient]),
    TokensModule,
    FoodsModule,
    IngredientsModule,
  ],
  exports: [FoodsIngredientsService],
})
export class FoodsIngredientsModule {}
