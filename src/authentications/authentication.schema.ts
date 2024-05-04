import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

const AuthenticationSchema: SchemaObject = {
  type: "object",
  properties: {
    accessToken: {
      type: "string",
      description: "Токен доступу для користувача",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
    refreshToken: {
      type: "string",
      description: "Токен оновлення доступу для користувача",
      example: "y231JhbOiJIDAUziIsInR5cCI6IkpXSCVCJ2...",
    },
  },
};

export default AuthenticationSchema;
