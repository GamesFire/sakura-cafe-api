import { ApiProperty } from "@nestjs/swagger";
import { Food } from "src/foods/food.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @ApiProperty({
    description: "Унікальний ідентифікатор категорії",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Назва категорії",
    example: "Суші",
    uniqueItems: true,
    nullable: false,
  })
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty({
    description: "Їжа, пов'язана з категорією",
    type: () => [Food],
  })
  @OneToMany(() => Food, (food) => food.category)
  foods: Food[];
}
