import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionManagementService } from '../../../core/services/session-management.service';
import { AuthService } from '../../../features/authentication/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService, private sessionService: SessionManagementService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (!this.authService.isSessionExpired()) {
    //   // // console.log('session not expired');
    //   return true;
    // }
    if (await this.sessionService.checkSession()) {
      return true;
    }

    // // console.log('session expired');

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return true;
  }
}
