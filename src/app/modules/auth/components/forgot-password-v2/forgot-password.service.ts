import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  ResetPasswordCheckUserRequestPayload,
  ResetPasswordCheckUserResponsePayload,
  ResetPasswordRequestPayload,
  ResetPasswordResponsePayload,
  ResetPasswordValidateOtpRequestPayload,
  ResetPasswordValidateOtpResponsePayload,
} from './forgot-password.model';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  checkUser(username: string): Observable<ResetPasswordCheckUserResponsePayload> {
    const url = `${this.apiUrl}/pfsvc/resetPwdCheckUser`;

    const payload: ResetPasswordCheckUserRequestPayload = {
      instId: '1',
      requestId: '2901021',
      serviceName: 'IB_RESET_PASSWORD',
      data: {
        FOR_SERVICE: 'IB_RESET_PASSWORD',
        IB_USERNAME: username,
      },
    };

    return this.http.post<ResetPasswordCheckUserResponsePayload>(url, payload);
  }

  validateOtp(
    username: string,
    otp: string,
    sessionId: string,
  ): Observable<ResetPasswordValidateOtpResponsePayload> {
    const url = `${this.apiUrl}/pfsvc/resetPwdValOtp`;

    const payload: ResetPasswordValidateOtpRequestPayload = {
      instId: '1',
      requestId: '2901021',
      serviceName: 'IB_RESET_PASSWORD',
      sessionId: sessionId,
      data: {
        FOR_SERVICE: 'IB_RESET_PASSWORD',
        IB_USERNAME: username,
        ENTERED_OTP: otp,
      },
    };

    return this.http.post<ResetPasswordValidateOtpResponsePayload>(url, payload);
  }

  resetPassword(
    username: string,
    newPassword: string,
    reNewPassword: string,
    sessionId: string,
  ): Observable<ResetPasswordResponsePayload> {
    const url = `${this.apiUrl}/pfsvc/resetPwd`;

    const payload: ResetPasswordRequestPayload = {
      instId: '1',
      requestId: '2901021',
      serviceName: 'IB_RESET_PASSWORD',
      sessionId: sessionId,
      data: {
        FOR_SERVICE: 'IB_RESET_PASSWORD',
        IB_USERNAME: username,
        CPIN_NEWPIN: newPassword,
        CPIN_RENEWPIN: reNewPassword,
      },
    };

    return this.http.post<ResetPasswordResponsePayload>(url, payload);
  }
}
