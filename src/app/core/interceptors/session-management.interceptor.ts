import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class SessionManagementInterceptor implements HttpInterceptor {
  constructor(
    // private authService: SessionManagementService,
    private router: Router, // private toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401 && error.url !== 'login') {
              Swal.fire({
                title: 'Session Expired',
                text: 'Your session has been expired, please login again',
                icon: 'error',
                heightAuto: false,

                confirmButtonText: 'Login',
              }).then((res: any) => {
                if (res.isConfirmed) {
                  localStorage.clear(); // todo: need to replace it with storage service
                  window.location.reload();
                  this.router.navigateByUrl('/auth/login');
                }
              });
            }
          }
        },
      ),
    );
  }
}

export const SessionManagementProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: SessionManagementInterceptor,
  multi: true,
};
