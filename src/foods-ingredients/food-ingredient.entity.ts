import { ApiProperty } from "@nestjs/swagger";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Food } from "../foods/food.entity";
import { Ingredient } from "src/ingredients/ingredient.entity";

@Entity({ name: "food_ingredient" })
export class FoodIngredient {
  @ApiProperty({
    description: "Унікальний ідентифікатор асоціації їжа-інгредієнт",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Їжа, пов'язана з асоціацією їжа-інгредієнт",
    type: () => Food,
  })
  @ManyToOne(() => Food)
  @JoinColumn({ name: "food_id" })
  food: Food;

  @ApiProperty({
    description: "Інгредієнт, пов'язаний з асоціацією їжа-інгредієнт",
    type: () => Ingredient,
  })
  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: "ingredient_id" })
  ingredient: Ingredient;
}
