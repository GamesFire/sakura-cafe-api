import { Request } from "express";

export interface UserPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  isActivated: boolean;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}
