import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserDataService } from '../../../core/services/user-data.service';
import { ActiveLoan } from '../models/active-loans.model';
import { LoanStatementPayloadModel } from '../models/loan-statement-payload.model';
import { LoanStatementResponseModel } from '../models/loan-statement-response.model';
import { LoanStatementStateService } from './loan-statement-state.service';

export interface ILoanStatementQuery {
  contractNumber: string;
  statementType: 'MS' | 'FS';
  startDate: string;
  endDate: string;
}
@Injectable({
  providedIn: 'root',
})
export class LoanStatementEffectService {
  private loanStatementUrl: string = environment.apiUrl2 + '/accsvc/loanStatement';

  private ongoingRequests: Map<ILoanStatementQuery, Observable<any>> = new Map();
  private cacheResponse: Map<ILoanStatementQuery, Partial<LoanStatementResponseModel>> = new Map();

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private loanStatementStateService: LoanStatementStateService,
  ) {}

  // ============== Reducers and Effects ==============
  private fetchLoanStatement(
    contractNumber: string,
    statementType: 'MS' | 'FS' = 'MS',
    startDate: string = '2020-01-01',
    endDate: string = '2024-02-01',
    forceRequest: boolean = false,
  ) {
    const userData = this.userDataService.getUserData();
    const loginId = userData.genericServiceBean.newLoginBean.loginId;
    const sessionId = userData.sessionId;

    const payload = new LoanStatementPayloadModel(
      contractNumber,
      statementType,
      startDate,
      endDate,
    );
    payload.newLoginBean.loginId = loginId;
    payload.sessionId = sessionId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'channel': 'IBCustomer',
      'inst': '1',
    });

    let requestKey: ILoanStatementQuery = {
      contractNumber: contractNumber,
      statementType: statementType,
      startDate: startDate,
      endDate: endDate,
    };
    let requestObservable: Observable<any>;
    let requestResponse: Partial<LoanStatementResponseModel> = {};

    if (!forceRequest && this.cacheResponse.has(requestKey)) {
      requestResponse = this.cacheResponse.get(requestKey)!;
      if (requestResponse)
        this.loanStatementStateService.updateLoanStatementState({
          contractNumber: contractNumber,
          statements: requestResponse,
        });
      return;
    }

    if (this.ongoingRequests.has(requestKey)) {
      // requestObservable = this.ongoingRequests.get(requestKey)!;
      requestObservable = this.loanStatementStateService.loanStatementState$;
    } else {
      requestObservable = this.http.post(this.loanStatementUrl, payload, {
        headers,
      });
    }

    requestObservable
      .pipe(takeUntilDestroyed())
      .subscribe((response: Partial<LoanStatementResponseModel>) => {
        if (response.status === 'SUCCESS') {
          this.cacheResponse.set(requestKey, response);
          this.ongoingRequests.delete(requestKey);

          this.loanStatementStateService.updateLoanStatementState({
            contractNumber: contractNumber,
            statements: response,
          });
        } else if (response.status === 'FAILURE') {
          console.error('Something went wrong while fetching statement');
        }
      });
  }

  public cachedFetchLoanStatement(
    contractNumber: string,
    statementType: 'MS' | 'FS' = 'MS',
    startDate: string = '2020-01-01',
    endDate: string = '2024-02-01',
  ) {
    this.fetchLoanStatement(contractNumber, statementType, startDate, endDate, false);
  }

  public forceFetchLoanStatement(
    contractNumber: string,
    statementType: 'MS' | 'FS' = 'MS',
    startDate: string = '2020-01-01',
    endDate: string = '2024-02-01',
  ) {
    this.fetchLoanStatement(contractNumber, statementType, startDate, endDate, true);
  }

  public fetchActiveLoans() {
    const allAccList = this.userDataService?.getUserData()?.genericServiceBean?.newLoginBean
      ?.doMobeeCustomer?.allAccList as ActiveLoan[];

    this.loanStatementStateService.updateActiveLoanState(allAccList);
  }
}
