import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { resolve } from "path";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./authentications/authentications.module";
import { TokensModule } from "./tokens/tokens.module";
import { MailModule } from "./mails/mails.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { TraysModule } from "./trays/trays.module";
import { FoodsModule } from "./foods/foods.module";
import { CategoriesModule } from "./categories/categories.module";
import { TraysFoodsModule } from "./trays-foods/trays-foods.module";
import { FilesModule } from "./files/files.module";
import { RatingModule } from "./ratings/ratings.module";
import { OrdersModule } from "./orders/orders.module";
import { IngredientsModule } from './ingredients/ingredients.module';
import { FoodsIngredientsModule } from './foods-ingredients/foods-ingredients.module';
import databaseConfig from "config/database.config";
import mailerConfig from "config/mailer.config";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, "static"),
      renderPath: "static",
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    MailerModule.forRoot(mailerConfig()),
    UsersModule,
    AuthModule,
    TokensModule,
    MailModule,
    TraysModule,
    FoodsModule,
    CategoriesModule,
    TraysFoodsModule,
    FilesModule,
    RatingModule,
    OrdersModule,
    IngredientsModule,
    FoodsIngredientsModule,
  ],
})
export class AppModule {}
