import { DocumentBuilder } from "@nestjs/swagger";

const documentation = new DocumentBuilder()
  .setTitle("SakuraCafe API")
  .setDescription("Документація SakuraCafe API")
  .setVersion("1.0.0")
  .addTag("Lobix")
  .setContact("Yevhenii", "https://github.com/GamesFire", "lobix2005@gmail.com")
  .addServer(`${process.env.API_URL}`)
  .addBasicAuth()
  .addBearerAuth(
    {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "Введіть токен JWT",
      in: "header",
    },
    "JWT-auth"
  )
  .build();

export default documentation;
