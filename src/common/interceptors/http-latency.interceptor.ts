import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AppRequest } from '../../shared/interfaces';

@Injectable()
export class HttpLatencyInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: AppRequest = context.switchToHttp().getRequest();

    request.startTime = new Date();

    return next.handle();
  }
}
