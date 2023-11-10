import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SecureStorageService } from '../../../core/services/secure-storage.service';
import { IbUserModel } from '../../../modules/auth/models/ib-user.model';
import { LoanStatementPayloadModel } from '../models/loan-statement-payload.model';

@Injectable({
  providedIn: 'root',
})
export class LoanStatementHttpService implements OnDestroy {
  private readonly loanStatementUrl = environment.apiUrl2 + '/accsvc/loanStatement';

  constructor(private http: HttpClient, private storage: SecureStorageService) {}

  ngOnDestroy() {}

  getLoanStatementByLoanNumber(
    loanNumber: string,
    statementType: 'MS' | 'FS' = 'MS',
    startDate: string = '2020-01-01',
    endDate: string = '2024-02-01',
  ) {
    // payloads for loan statement
    const userData = JSON.parse(this.storage.get('user-data')) as IbUserModel;
    const userLoginId = userData.genericServiceBean.newLoginBean.loginId;
    const sessionId = userData.sessionId;

    const payload = new LoanStatementPayloadModel(
      loanNumber as string,
      statementType,
      startDate,
      endDate,
    );
    payload.newLoginBean.loginId = userLoginId;
    payload.sessionId = sessionId;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'channel': 'IBCustomer',
      'inst': '1',
    });
    return this.http.post(this.loanStatementUrl, payload, {
      headers: headers,
    });
  }
}
