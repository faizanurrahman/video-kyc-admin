import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { HttpLoaderService } from '../services/http-loader.service';

@Injectable()
export class HttpLoaderInterceptor implements HttpInterceptor {
  constructor(private _loading: HttpLoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._loading.setLoading(true, request.url);
    return next
      .handle(request)
      .pipe(
        catchError((err) => {
          this._loading.setLoading(false, request.url);
          // // console.log('error is ', err);
          throw err;
        }),
      )
      .pipe(
        map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse) {
            this._loading.setLoading(false, request.url);
          }
          return evt;
        }),
      );
  }
}

export const HttpLoaderProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpLoaderInterceptor,
  multi: true,
};
