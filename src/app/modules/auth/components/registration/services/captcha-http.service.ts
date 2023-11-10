import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {
  CaptchaModelRequest,
  CaptchaModelResponse,
  CaptchaRequestData,
  CaptchaRequestPayload,
  CaptchaResponsePayload,
} from '../models/captcha.model';
// import {UserDataService} from "../../../core/services/user-data.service";

@Injectable({
  providedIn: 'root',
})
export class CaptchaHttpService {
  private captchaUrl: string = environment.apiUrl + '/pfsvc/getChallenge';
  private varifyCaptchaUrl: string = environment.apiUrl + '/pfsvc/selfOptinIB/paramValidation';

  constructor(private http: HttpClient) {}

  getCaptchaChallenge(width: string = '160', height: string = '80') {
    const payLoad: CaptchaModelRequest = {
      instId: '1',
      requestId: '2901021',
      serviceName: 'GET_CHALLENGE',
      data: {
        CAPTCHA_HEIGHT: height,
        CAPTCHA_WIDTH: width,
      },
    };

    // // console.log('captcha Challenge http');
    return this.http.post(this.captchaUrl, payLoad) as Observable<CaptchaModelResponse>;
  }

  verifyCaptcha(data: CaptchaRequestData, sessionId: string) {
    // const userData = this.userDataService.getUserData();

    const payload: CaptchaRequestPayload = {
      instId: '1',
      requestId: '2929292',
      serviceName: 'IB_CUST_SELF_OPTIN',
      data: data,
      sessionId: sessionId,
      // sessionId: userData.sessionId
    };

    return this.http.post(this.varifyCaptchaUrl, payload) as Observable<CaptchaResponsePayload>;
    // return of({
    //   "status": "SUCCESS",
    //   "statusCode": "00",
    //   "statusDesc": "Param Validation Successfully Processed",
    //   "instId": 1,
    //   "serviceName": "IB_CUST_SELF_OPTIN",
    //   "requestId": "2901021",
    //   "sessionId": "6f511372-e989-4d32-a4cf-efffaf10ee95",
    //   "decisionPageRequired": false,
    //   "data": {
    //     "MOBILE_NO": "2676865656",
    //     "BP_NUMBER": "2000041046",
    //     "TYPE": "WITH_BP",
    //     "IB_USERNAME": "testreg",
    //     "CAPTCHA_USER_ANSWER": "8mwy7",
    //     "CUST_NAME": "RIDGE RONNIE RONALD"
    //   }
    // }).pipe(delay(2000));
  }
}
