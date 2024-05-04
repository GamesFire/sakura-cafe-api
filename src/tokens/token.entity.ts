import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Token {
  @ApiProperty({
    description: "Унікальний ідентифікатор токена",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Токен оновлення",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    nullable: false,
  })
  @Column({ name: "refresh_token", nullable: false })
  refreshToken: string;

  @ApiProperty({
    type: () => User,
    description: "Користувач, пов'язаний з цим токеном",
  })
  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
