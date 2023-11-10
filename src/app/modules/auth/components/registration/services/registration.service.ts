import { Injectable } from '@angular/core';
import { RegisterRequestData } from '../models/register.model';
import { CaptchaService } from './captcha.service';
import { RegistrationHttpService } from './registration-http.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  public captchaResponse: any;
  constructor(
    private registrationHttpService: RegistrationHttpService,
    private captchaService: CaptchaService,
  ) {}

  registerCustomer(data: RegisterRequestData) {
    this.captchaResponse = this.captchaService.currentCaptchaValue;
    let sessionId = this.captchaResponse.sessionId;
    return this.registrationHttpService.registerNewUser(data, sessionId);

    // return this.captchaService.currentCaptcha$.pipe(
    //   switchMap(res => {
    //     const sessionId = res.sessionId;
    //     return this.registrationHttpService.registerNewUser(data, sessionId);
    //   }),
    // );
    // return this.registrationHttpService.registerNewUser(data);
  }
}
