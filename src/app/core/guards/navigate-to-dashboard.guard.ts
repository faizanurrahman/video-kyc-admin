import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../modules/auth';
import { SessionManagementService } from '../services/session-management.service';

@Injectable({
  providedIn: 'root',
})
export class NavigateToDashboardGuard {
  constructor(
    private authService: AuthService,
    private sessionService: SessionManagementService, // private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isSessionExpired = this.authService.isSessionExpired();

    // if (isSessionExpired) {
    //   return true;
    // }

    // return false;
    // return !this.sessionService.checkSession();
    return true;
  }
}
