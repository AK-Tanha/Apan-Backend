import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CACHE_CONTROL_KEY } from '../decorators/cache-control.decorator';

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const value = Reflect.getMetadata(
      CACHE_CONTROL_KEY,
      context.getHandler(),
    ) as string | undefined;

    if (value) {
      context
        .switchToHttp()
        .getResponse<import('express').Response>()
        .setHeader('Cache-Control', value);
    }

    return next.handle();
  }
}
