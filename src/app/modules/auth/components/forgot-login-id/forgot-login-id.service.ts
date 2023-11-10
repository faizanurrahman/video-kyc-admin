import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ValidateOTPPayloadModel, ValidateUserPayloadModel } from './forgot-login-id.model';

@Injectable()
export class ForgotLoginIdService {
  private checkUserUrl = environment.apiUrl + '/pfsvc/forgotIdCheckUser';
  private validateOtpUrl = environment.apiUrl + '/pfsvc/forgotIdValOtp';

  constructor(private htttp: HttpClient, private destroyRef: DestroyRef) {}

  checkUser(data: any) {
    const payload: ValidateUserPayloadModel = {
      serviceName: 'IB_FORGOT_LOGIN_ID',
      data: {
        FOR_SERVICE: 'IB_FORGOT_LOGIN_ID',
        RETRIEVAL_TYPE: data.verificationType === 'MOBILE' ? 'WITHOUT_BP' : 'WITH_BP',
        BP_NUMBER: data?.bpNumber || '',
        MOBILE_NO: data?.mobileNumber || '',
        DOB: data?.dateOfBirth || '',
      },
    };

    return this.htttp
      .post(this.checkUserUrl, payload)
      .pipe(takeUntilDestroyed(this.destroyRef)) as Observable<any>;
  }

  validateOtp(data: any, sessionId: any) {
    const payload: ValidateOTPPayloadModel = {
      instId: '1',
      requestId: '2901021',
      serviceName: 'IB_FORGOT_LOGIN_ID',
      sessionId: sessionId,
      data: {
        FOR_SERVICE: 'IB_FORGOT_LOGIN_ID',
        ENTERED_OTP: data?.otp || '',
      },
    };

    return this.htttp
      .post(this.validateOtpUrl, payload)
      .pipe(takeUntilDestroyed(this.destroyRef)) as Observable<any>;
  }
}
