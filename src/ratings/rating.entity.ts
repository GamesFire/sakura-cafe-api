import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Food } from "../foods/food.entity";
import { User } from "../users/user.entity";

@Entity()
export class Rating {
  @ApiProperty({
    description: "Унікальний ідентифікатор рейтингу",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Рейтингове значення", example: 3, default: 0 })
  @Column({ default: 0 })
  rate: number;

  @ApiProperty({ description: "Користувач, який відправив оцінку" })
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ApiProperty({ description: "Оцінювана їжа" })
  @ManyToOne(() => Food)
  @JoinColumn({ name: "food_id" })
  food: Food;
}
