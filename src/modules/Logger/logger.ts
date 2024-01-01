import { Request, Response, NextFunction } from 'express';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NestMiddleware } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Received a ${req.method} request on ${req.url} with body ${JSON.stringify(req.body)}`);
    next();
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const { method, url, body } = request;

    return next.handle().pipe(
      tap(() =>
        console.log(`Received a ${method} request on ${url} with body ${JSON.stringify(body)}. Response status: ${response.statusCode}`),
      ),
      catchError((error) => {
        console.log(`Error: ${error.message}`);
        throw error;
      }),
    );
  }
}
