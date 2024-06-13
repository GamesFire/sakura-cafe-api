import { ApiProperty } from "@nestjs/swagger";
import { Food } from "src/foods/food.entity";
import { User } from "src/users/user.entity";
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Tray {
  @ApiProperty({
    description: "Унікальний ідентифікатор таці",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Користувач, пов'язаний з відповідною тацею",
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ApiProperty({
    description: "Їжа, пов'язана з тацею",
    type: () => [Food],
  })
  @ManyToMany(() => Food, (food) => food.trays)
  @JoinTable({
    name: "tray_food",
    joinColumn: { name: "tray_id" },
    inverseJoinColumn: { name: "food_id" },
  })
  foods: Food[];
}
