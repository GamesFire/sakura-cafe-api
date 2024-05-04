import { ApiProperty } from "@nestjs/swagger";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tray } from "../trays/tray.entity";
import { Food } from "../foods/food.entity";

@Entity({ name: "tray_food" })
export class TrayFood {
  @ApiProperty({
    description: "Унікальний ідентифікатор асоціації таця-їжа",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Таця, пов'язана з асоціацією таця-їжа",
    type: () => Tray,
  })
  @ManyToOne(() => Tray)
  @JoinColumn({ name: "tray_id" })
  tray: Tray;

  @ApiProperty({
    description: "Їжа, пов'язана з асоціацією таця-їжа",
    type: () => Food,
  })
  @ManyToOne(() => Food)
  @JoinColumn({ name: "food_id" })
  food: Food;
}
