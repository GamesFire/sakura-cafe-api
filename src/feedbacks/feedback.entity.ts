import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Feedback {
  @ApiProperty({
    description: "Унікальний ідентифікатор зворотного зв'язку",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Тема зворотного зв'язку",
    example: "Якість обслуговування",
    nullable: false,
  })
  @Column({ nullable: false })
  subject: string;

  @ApiProperty({
    type: "text",
    description: "Зміст повідомлення зворотного зв'язку",
    example:
      "Обслуговування було чудовим, але час очікування був занадто довгим.",
    nullable: false,
  })
  @Column({ type: "text", nullable: false })
  message: string;

  @ApiProperty({
    description: "Мітка часу з часовим поясом, що вказує на дату зворотного зв'язку",
    example: "2024-04-13 15:33:09.388+02",
    nullable: true,
  })
  @Column({
    type: "timestamptz",
    nullable: true,
  })
  date: Date;

  @ApiProperty({
    description: "Індикатор, який показує, чи був оброблений зворотний зв'язок",
    example: true,
    default: false,
  })
  @Column({ default: false })
  isProcessed: boolean;

  @ApiProperty({
    description: "Користувач, пов'язаний з зворотним зв'язком",
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
