import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modules/auth';

@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  private timeoutInMilliseconds = 200 * 60 * 1000; // 200 minutes
  private timeoutId: any;

  constructor(private router: Router, private authService: AuthService) {}

  startSessionTimeout() {
    this.clearSessionTimeout();
    this.timeoutId = setTimeout(() => {
      // Redirect to logout or login page
      this.authService.logout();
    }, this.timeoutInMilliseconds);
  }

  clearSessionTimeout() {
    clearTimeout(this.timeoutId);
  }
}
