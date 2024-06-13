import { ApiProperty } from "@nestjs/swagger";
import { Food } from "src/foods/food.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ingredient {
  @ApiProperty({
    description: "Унікальний ідентифікатор інгредієнта",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Назва інгредієнта",
    nullable: false,
    uniqueItems: true,
    example: "Норі",
  })
  @Column({ unique: true, nullable: false })
  title: string;

  @ApiProperty({
    description: "Частина UUID URL-адреси зображення інгредієнта",
    example: "c558a80a-f319-4c10-95d4-4282ef745b4b",
  })
  @Column()
  image: string;

  @ApiProperty({
    description: "Їжа, пов'язана з інгредієнтом",
    type: () => [Food],
  })
  @ManyToMany(() => Food, (food) => food.ingredients)
  foods: Food[];
}
