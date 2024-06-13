import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { Tray } from "src/trays/tray.entity";
import { TokensModule } from "src/tokens/tokens.module";
import { TraysModule } from "src/trays/trays.module";
import { UsersModule } from "src/users/users.module";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Order, Tray]),
    TokensModule,
    TraysModule,
    UsersModule,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
