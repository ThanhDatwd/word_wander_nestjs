import { LOGIN_MODE } from 'src/shared/constants';

// src/modules/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
  username: string;
  id: number;
  roles: string[];
  permissions: string[];
}
export interface LoginPayload {
  username: string;
  password: string;
  mode: LOGIN_MODE;
}
