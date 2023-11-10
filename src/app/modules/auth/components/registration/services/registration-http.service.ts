import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { RegisterRequestData, RegisterRequestPayload } from '../models/register.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationHttpService {
  private registrationFinalUrl: string = environment.apiUrl + '/pfsvc/selfOptin/process';

  // private subs: Subscription[];

  constructor(private http: HttpClient) {}

  registerNewUser(data: RegisterRequestData, sessionId: string) {
    const payload: RegisterRequestPayload = {
      data: data,
      requestId: '1222',
      serviceName: 'IB_CUST_SELF_OPTIN',
      sessionId: sessionId,
    };

    return this.http.post(this.registrationFinalUrl, payload);
    // return of({
    //   status: 'SUCCESS',
    //   statusCode: '000',
    //   statusDesc: 'Customer Successfully Registered',
    //   instId: 1,
    //   serviceName: 'IB_CUST_SELF_OPTIN',
    //   requestId: '25671234599324012023080821984',
    //   sessionId: '6f511372-e989-4d32-a4cf-efffaf10ee95',
    //   newLoginBean: {
    //     tncStatus: false,
    //   },
    //   genericServiceBean: {
    //     channelId: 2001,
    //     referenceId: '25671234599324012023080821984',
    //     statusCode: 'SUCCESS',
    //     statusDesc: 'Transaction Successful',
    //     serviceId: 9100,
    //     instId: 1,
    //     endSession: false,
    //     resultSet: {
    //       className: 'StringTypeResultSet',
    //       response: 'Customer Successfully Registered',
    //     },
    //     doMobeeCustomer: {
    //       acctPrimary: null,
    //       alertEmail: null,
    //       charges: null,
    //       custId: null,
    //       custName: null,
    //       dataSourceList: null,
    //       doSapBpQueryResponse: null,
    //       allAccList: null,
    //       instId: 1,
    //       langId: 1,
    //       mobileNumber: null,
    //       mvisaId: null,
    //       picId: null,
    //       sPackId: null,
    //       spackId: null,
    //       doMobeeCustomerString: 'null|1|null|null|\n',
    //     },
    //     newLoginBean: {
    //       tncStatus: false,
    //     },
    //   },
    //   decisionPageRequired: false,
    //   data: {
    //     MOBILE_NO: '2676865656',
    //     BP_NUMBER: '2000041046',
    //     TYPE: 'WITH_BP',
    //     IB_USERNAME: 'testreg',
    //     OTP: '1111',
    //     IB_PASSWORD: '1234',
    //     IB_CONFIRM_PASSWORD: '1234',
    //     msg: 'Customer Successfully Registered',
    //   },
    // }).pipe(delay(2000));
  }
}
