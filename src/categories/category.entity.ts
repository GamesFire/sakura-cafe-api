import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
