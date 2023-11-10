import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if content type is not set, set it to json

    // if reqeust url container pfsvc/loan/uploadDoc then set content type to multipart/form-data
    if (request.url.includes('pfsvc/loan/uploadDoc')) {
      return next.handle(request);
    } else if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    // add header
    // request = request.clone({
    //   headers: request.headers
    //     .set('channel', 'IBCustomer')
    //     .set('inst', '1')
    //     .set('Strict-Transport-Security', 'false'),
    // });

    //     channel: 'IBCustomer',
    //     inst: '1',
    //     'Content-Type': 'application/json',

    return next.handle(request);
  }
}

export const HttpHeaderProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpHeaderInterceptor,
  multi: true,
};
