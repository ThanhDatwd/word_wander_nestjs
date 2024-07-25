import { stringUtils } from 'mvc-common-toolkit';
import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import { AppRequest } from '../../shared/interfaces';
import { getLogId } from '../decorators/logging';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private logger = new Logger(this.constructor.name, { timestamp: true });

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: AppRequest = context.switchToHttp().getRequest();
    const logId = getLogId(request);

    const maskedRequestBody = request.body
      ? JSON.stringify(request.body, this.maskSensitiveData)
      : '';

    this.logger.debug(
      `[${logId}]: Request: ${(request as any).user?.email || ''} ${
        request.method
      } ${request.url} ${maskedRequestBody}`,
    );

    return next.handle().pipe(
      tap((responseBody) => {
        const maskedResponseBody = JSON.stringify(
          responseBody,
          this.maskSensitiveData,
        );
        this.logger.debug(`[${logId}]: Response: ${maskedResponseBody}`);
      }),
    );
  }

  private maskSensitiveData(key: string, value: any) {
    if (typeof value === 'string') {
      return stringUtils.maskFn(key, value);
    }
    if (key === 'password') {
      return '***masked***';
    }
    return value;
  }
}
