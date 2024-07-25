import dayjs from 'dayjs';
import { AuditService, ErrorLog, HttpResponse } from 'mvc-common-toolkit';
import { Observable, catchError, map, of } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import { AppRequest } from 'src/shared/interfaces';
import { APP_ACTION, ERR_CODE, HEADER_KEY } from 'src/shared/constants';
import { PrometheusGateway } from 'src/gateways/prometheus.gateway';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  protected logger = new Logger(HttpResponseInterceptor.name);

  constructor(
    protected auditService: AuditService,
    protected prometheusGateway: PrometheusGateway,
  ) {}

  public intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const httpReq: AppRequest = ctx.switchToHttp().getRequest();
    const logId = ctx.switchToHttp().getRequest().headers[HEADER_KEY.LOG_ID];
    const startDate = httpReq.startTime;
    const duration = dayjs().diff(startDate);

    return next.handle().pipe(
      map((response: HttpResponse) => {
        this.prometheusGateway.recordHttpResponse({
          path: httpReq.path,
          duration,
          method: httpReq.method,
          statusCode: (response?.httpCode || 200).toString(),
        });

        if (response?.httpCode) {
          return response;
        }

        if (response?.success === false) {
          return {
            success: false,
            code: response.code,
            httpCode: response.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
            message: response.message,
          };
        }

        if (response?.success === true) {
          delete response.success;
        }

        const payload = response?.data || response;

        return { data: payload, success: true };
      }),
      catchError((error) => {
        this.logger.error(error.message, error.stack);

        this.prometheusGateway.recordHttpResponse({
          path: httpReq.path,
          duration,
          method: httpReq.method,
          statusCode: (error.getStatus?.() || 500).toString(),
        });

        if (!(error instanceof HttpException)) {
          this.auditService.emitLog(
            new ErrorLog({
              logId,
              action: APP_ACTION.HANDLE_EXCEPTION,
              message: error.message,
              metadata: {
                url: httpReq.url,
              },
            }),
          );

          return of({
            success: false,
            message: 'internal server error',
            code: ERR_CODE.INTERNAL_SERVER_ERROR,
          });
        }

        return of(error);
      }),
    );
  }
}
