import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private forcedPasswordChangeUrl = environment.apiUrl + '/checkPasswordChange';

  constructor(private http: HttpClient, private destroyRef: DestroyRef) {}

  checkForcePasswordChange() {
    this.http.post(this.forcedPasswordChangeUrl, {});
  }
}
