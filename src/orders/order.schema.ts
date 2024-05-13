import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { Role } from "src/users/user.entity";
import { Status } from "./order.entity";

export const OrderSchema: SchemaObject = {
  type: "object",
  properties: {
    id: { type: "number", example: 1 },
    date: {
      type: "string",
      format: "date-time",
      example: "2024-04-13 15:33:09.388+02",
    },
    tray: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        user: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            name: { type: "string", example: "Джон Доу" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: { type: "string", example: "password123" },
            role: {
              type: "string",
              enum: Object.values(Role),
              example: "guest",
            },
            activationLink: {
              type: "string",
              example: "c83d5864-77e2-40c7-b70a-9a6a8f729e45",
            },
          },
          required: [
            "id",
            "name",
            "email",
            "password",
            "role",
            "activationLink",
          ],
        },
      },
      required: ["id", "user"],
    },
  },
  required: ["id", "date", "tray"],
};

export default function generateOrderSchema(statusEnum: Status): SchemaObject {
  return {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: Object.values(Status),
        example: statusEnum,
      },
      ...OrderSchema.properties,
    },
    required: ["status", ...OrderSchema.required],
  };
}
