import { ApiProperty } from "@nestjs/swagger";
import { Tray } from "src/trays/tray.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum Status {
  PENDING = "на розгляді",
  ACCEPTED = "прийнято",
  REJECTED = "відхилено",
  CANCELED = "скасовано",
}

@Entity()
export class Order {
  @ApiProperty({
    description: "Унікальний ідентифікатор замовлення",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    enum: Status,
    enumName: "Status",
    default: Status.PENDING,
    description: "Статус замовлення",
    example: "на розгляді",
  })
  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING,
  })
  status: string;

  @ApiProperty({
    description: "Мітка часу з часовим поясом, що вказує на дату замовлення",
    example: "2024-04-13 15:33:09.388+02",
    nullable: true,
  })
  @Column({
    type: "timestamptz",
    nullable: true,
  })
  date: Date;

  @ApiProperty({
    description: "Таця, яка пов'язана із замовленням",
    type: () => Tray,
  })
  @OneToOne(() => Tray)
  @JoinColumn({ name: "tray_id" })
  tray: Tray;
}
