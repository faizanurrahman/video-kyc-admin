import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs';
import {environment} from '@environments/environment';
import {UserDataService} from '@core/services/user-data.service';
import {IbUserModel} from '@auth/models/ib-user.model';
import {
  LoanApplicationOtpGenRequestBean,
  LoanApplicationOtpValidateRequestBean,
} from '@lam/models/loan-application-contact-verfication.interface';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationContactVarificationService {
  private validationUrl = environment.apiUrl + '/pfsvc/valOTP';
  private generateOtpUrl = environment.apiUrl + '/pfsvc/genOTP';

  constructor(private http: HttpClient, private userData: UserDataService) {
  }

  validateContact(otp: string, type: 'PHONE' | 'EMAIL' | 'NONE') {
    const userData: IbUserModel = this.userData.getUserData()!;
    const payload: LoanApplicationOtpValidateRequestBean = {
      newLoginBean: {
        loginId: userData.genericServiceBean.newLoginBean.loginId,
        transactionId: '24012023080821984256712345993',
      },
      serviceName: 'IB_CONTACT_VERIFY',
      requestId: '25671234599324012023080821984',
      sessionId: userData.sessionId,
      data: {
        FOR_SERVICE: 'LOAN_APP',
        ENTERED_OTP: otp,
      },
    };

    return this.http.post(this.validationUrl, payload).pipe(
      map((response: any) => {
        return {
          status: response.status,
          statusCode: response.statusCode,
          statusDesc: response.statusDesc,
          data: response.data,
        };
      }),
    );
  }

  generateOtp(contact: string, type: 'PHONE' | 'EMAIL' | 'NONE') {
    const userData: IbUserModel = this.userData.getUserData()!;

    const payload: LoanApplicationOtpGenRequestBean = {
      newLoginBean: {
        loginId: userData.genericServiceBean.newLoginBean.loginId,
        transactionId: '24012023080821984256712345993',
      },
      serviceName: 'IB_CONTACT_VERIFY',
      requestId: '25671234599324012023080821984',
      sessionId: userData.sessionId,
      data: {
        CONTACT_TYPE: type,
        CONTACT_NO: type === 'PHONE' ? contact : undefined,
        CONTACT_EMAIL: type === 'EMAIL' ? contact : undefined,
        FOR_SERVICE: 'LOAN_APP',
      },
    };

    return this.http.post(this.generateOtpUrl, payload).pipe(
      map((response: any) => {
        return {
          status: response.status,
          statusCode: response.statusCode,
          statusDesc: response.statusDesc,
          data: response.data,
        };
      }),
    );
  }
}
