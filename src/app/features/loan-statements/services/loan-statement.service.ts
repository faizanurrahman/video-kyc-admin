import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CryptoService } from '../../../core/services/crypto.service';
import { StorageService } from '../../../core/services/storage.service';
import { IbUserModel } from '../../../modules/auth/models/ib-user.model';
import { LoanStatementPayloadModel } from '../models/loan-statement-payload.model';
import { LoanStatementResponseModel } from '../models/loan-statement-response.model';
import { LoanStatement } from '../models/loan-statements.model';
import { LoanStatementHttpService } from './loan-statement.http.service';

@Injectable({
  providedIn: 'root',
})
export class LoanStatementService implements OnDestroy {
  private loanStatementUrl = environment.apiUrl2 + '/accsvc/loanStatement';

  private _currentLoanStatementsBS: BehaviorSubject<LoanStatementResponseModel> =
    new BehaviorSubject<LoanStatementResponseModel>(new LoanStatementResponseModel());
  readonly currentLoanStatement$: Observable<LoanStatementResponseModel> =
    this._currentLoanStatementsBS.asObservable();

  public currentAccountNo: string | undefined = undefined;

  private subs: Subscription[] = [];

  get currentLoanStatement() {
    return this._currentLoanStatementsBS.value;
  }

  set currentLoanStatement(value: any) {
    this._currentLoanStatementsBS.next(value);
  }

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private crypto: CryptoService,
    private loanStatementHttpService: LoanStatementHttpService,
  ) {}

  /**
   * Todo: Need to remove this method
   * @deprecated use getLoanStatementByLoanNumber instead
   */
  getLoanStatementOf(accountNo: string | undefined) {
    // // console.log('account number in get loan statement of', accountNo);
    this.currentAccountNo = accountNo;
    if (accountNo === undefined) {
      this.currentLoanStatement = {};
      return;
    }
    // payloads for loan statement
    const userData = JSON.parse(this.crypto.decrypt(this.storage.get('user-data'))) as IbUserModel;
    const userLoginId = userData.genericServiceBean.newLoginBean.loginId;
    const sessionId = userData.sessionId;

    const payload = new LoanStatementPayloadModel(
      accountNo as string,
      'MS',
      '2022-01-01',
      '2023-02-01',
    );
    payload.newLoginBean.loginId = userLoginId;
    payload.sessionId = sessionId;

    const sub = this.http.post(this.loanStatementUrl, payload).subscribe((response: any) => {
      this.currentLoanStatement = response;
    });

    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((value) => {
      value.unsubscribe();
    });
  }

  getLoanStatementByLoanNumber(
    loanNumber: string,
    statementType: 'MS' | 'FS' = 'MS',
    startDate: string = '2022-01-01',
    endDate: string = '2023-02-01',
  ) {
    // const sub = this.loanStatementHttpService.getLoanStatementByLoanNumber(loanNumber, statementType, startDate, endDate).subscribe((response: any) => {

    //  });

    // this.subs.push(sub);
    return this.loanStatementHttpService
      .getLoanStatementByLoanNumber(loanNumber, statementType, startDate, endDate)
      .pipe(
        map((response: any) => {
          return response.data as LoanStatement;
        }),
      );
  }
}
