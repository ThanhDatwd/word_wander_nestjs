import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpLatencyInterceptor } from './common/interceptors/http-latency.interceptor';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
// import { HttpResponseInterceptor } from './common/interceptors/http-response.interceptor';
// import { PrometheusGateway } from './gateways/prometheus.gateway';
// import { INJECTION_TOKEN } from './shared/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const auditService = app.get(INJECTION_TOKEN.AUDIT_SERVICE);
  // const promGateway = app.get(PrometheusGateway);

  app.useGlobalInterceptors(
    new HttpLatencyInterceptor(),
    new HttpLoggingInterceptor(),
    // new HttpResponseInterceptor(auditService, promGateway),
  );

  await app.listen(8080).then(() => {
    console.log('listen port 8080');
  });
}
bootstrap();
