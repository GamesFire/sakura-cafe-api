import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export enum Role {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: "Унікальний ідентифікатор користувача",
  })
  id: number;

  @Column({ nullable: false })
  @ApiProperty({
    example: "Джон Доу",
    description: "Ім'я користувача",
    nullable: false,
  })
  name: string;

  @Column({ unique: true, nullable: false })
  @ApiProperty({
    example: "john@example.com",
    description: "Адреса електронної пошти користувача",
    uniqueItems: true,
    nullable: false,
  })
  email: string;

  @Column({ nullable: false })
  @ApiProperty({
    example: "password123",
    description: "Пароль користувача",
    nullable: false,
  })
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.GUEST,
  })
  @ApiProperty({
    enum: Role,
    enumName: "Role",
    default: Role.GUEST,
    description: "Роль користувача",
    example: "guest",
  })
  role: string;

  @Column({ name: "activation_link", nullable: false })
  @ApiProperty({
    example: "c83d5864-77e2-40c7-b70a-9a6a8f729e45",
    description: "Посилання для активації облікового запису користувача (UUID)",
    nullable: false,
  })
  activationLink: string;
}
