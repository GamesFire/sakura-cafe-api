import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "./pipes/validation.pipe";
import { NestExpressApplication } from "@nestjs/platform-express";
import documentation from "config/documentation.config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  app.setGlobalPrefix("/api");
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: `${process.env.CLIENT_URL}`,
  });
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, documentation);
  SwaggerModule.setup("/api/docs", app, document, {
    customSiteTitle: "API Documentation",
    customCss: `.swagger-ui .topbar { display: none; }`,
  });

  await app.listen(PORT, () => {
    console.log(`Server started on port = ${PORT}!`);
  });
}

bootstrap();
