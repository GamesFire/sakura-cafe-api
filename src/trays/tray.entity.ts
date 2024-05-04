import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}
