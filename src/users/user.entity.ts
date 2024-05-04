import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export enum Role {
  ADMIN = "адміністратор",
  USER = "користувач",
  GHOST = "привид",
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
    default: Role.GHOST,
  })
  @ApiProperty({
    enum: Role,
    enumName: "Role",
    default: Role.GHOST,
    description: "Роль користувача",
    example: "привид",
  })
  role: string;

  @Column({ name: "activation_link", nullable: false })
  @ApiProperty({
    example: "c83d5864-77e2-40c7-b70a-9a6a8f729e45",
    description: "Посилання для активації облікового запису користувача (UUID)",
    nullable: false,
  })
  activationLink: string;

  @Column({ name: "is_activated", default: false })
  @ApiProperty({
    example: true,
    description: "Індикатор, який показуює, чи активовано обліковий запис користувача",
    default: false,
  })
  isActivated: boolean;
}
