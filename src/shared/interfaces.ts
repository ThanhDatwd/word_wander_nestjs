import { Request } from 'express';
export interface AppRequest extends Request {
  startTime: Date;
}
