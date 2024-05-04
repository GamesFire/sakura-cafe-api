import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/categories/category.entity";
import { FoodIngredient } from "src/foods-ingredients/food-ingredient.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Food {
  @ApiProperty({
    description: "Унікальний ідентифікатор їжі",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Назва страви",
    nullable: false,
    uniqueItems: true,
    example: "Нігірі лосось",
  })
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty({
    description: "Вартість їжі",
    default: 0,
    minimum: 0,
    maximum: 999999.99,
    example: 599.99,
  })
  @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
  price: number;

  @ApiProperty({
    description: "Рейтинг їжі (середнє значення з усіх оцінок користувачів)",
    default: 0,
    minimum: 0,
    maximum: 5,
    example: 4.5,
  })
  @Column({ type: "decimal", precision: 2, scale: 1, default: 0 })
  rating: number;

  @ApiProperty({
    description: "Частина UUID URL-адреси зображення їжі",
    example: "88188c1d-1295-4f5a-9fd8-1979aa3c709c",
  })
  @Column()
  image: string;

  @ApiProperty({
    description: "Категорія, пов'язана з їжею",
    type: () => Category,
  })
  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @ApiProperty({
    description: "Інгредієнти, пов'язані з їжею",
    type: () => [FoodIngredient],
  })
  @OneToMany(() => FoodIngredient, (ingredient) => ingredient.food)
  ingredients: FoodIngredient[];
}
