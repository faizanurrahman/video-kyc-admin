import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDataService } from '../../../core/services/user-data.service';
import { LoanApplicationStateManagementService } from './loan-application-state-management.service';

@Injectable({ providedIn: 'root' })
export class LoanApplicationEffectService {
  private onGoingRequests: Map<string, Observable<any>> = new Map();
  private cacheResponse: Map<any, any> = new Map();

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private loanApplicationStateManagementService: LoanApplicationStateManagementService,
    private destroyRef: DestroyRef,
  ) {}

  // public fetchAllLoanApplications(forceRequest: boolean = false) {
  //   let getAllLoanApplicationUrl = environment.apiUrl + '/pfsvc/loan/getAllLoanApps';
  //   let selectorUniqueString = 'AllLoanDetails';
  //   let userDetails = this.userDataService.getUserData();
  //   const payload = {
  //     sessionId: userDetails.sessionId,
  //     userName: userDetails.genericServiceBean.newLoginBean.loginId,
  //   };

  //   let reqeustResponse: Partial<IAllLoanApplications> = {};
  //   let requestObservable: Observable<any>;

  //   if (!forceRequest && this.cacheResponse.has(selectorUniqueString)) {
  //     reqeustResponse = this.cacheResponse.get(selectorUniqueString);
  //     if (reqeustResponse) {
  //       this.loanApplicationStateManagementService.updateAllLoanApplicationState(reqeustResponse);
  //       return this.loanApplicationStateManagementService.allLoanApplication$;
  //     }
  //   }

  //   if (this.onGoingRequests.has(selectorUniqueString)) {
  //     // requestObservable = this.onGoingRequests.get(selectorUniqueString)!;
  //     requestObservable = this.loanApplicationStateManagementService.allLoanApplication$;
  //   } else {
  //     requestObservable = this.http.post(getAllLoanApplicationUrl, payload);
  //     this.onGoingRequests.set(selectorUniqueString, requestObservable);
  //     console.log('Hitting bacend from effect');
  //   }

  //   requestObservable
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((response: Partial<IAllLoanApplications>) => {
  //       if (response.status === 'SUCCESS') {
  //         this.cacheResponse.set(selectorUniqueString, response);
  //         this.onGoingRequests.delete(selectorUniqueString);
  //         this.loanApplicationStateManagementService.updateAllLoanApplicationState(response);
  //       }
  //     });

  //   return this.loanApplicationStateManagementService.allLoanApplication$;
  // }

  // public fetchCurrentLoanApplication(applicationId: string, forceRequest: boolean = false) {
  //   let getLoanApplicationDetailsUrl = environment.apiUrl + '/pfsvc/loan/getLoanAppDetails';
  //   let selectorUniqueString = '[Fetch Current Loan Details] ' + applicationId;
  //   let userDetails = this.userDataService.getUserData();

  //   const payload = {
  //     applicationId: applicationId,
  //     sessionId: userDetails.sessionId,
  //     username: userDetails.genericServiceBean.newLoginBean.loginId,
  //   };

  //   let reqeustResponse: Partial<LoanApplicationModel> = {};
  //   let requestObservable: Observable<any>;

  //   if (!forceRequest && this.cacheResponse.has(selectorUniqueString)) {
  //     reqeustResponse = this.cacheResponse.get(selectorUniqueString);
  //     if (reqeustResponse) {
  //       this.loanApplicationStateManagementService.updateCurrentLoanApplicationState(
  //         reqeustResponse,
  //       );
  //       return this.loanApplicationStateManagementService.currentLoanApplication$;
  //     }
  //   }

  //   if (this.onGoingRequests.has(selectorUniqueString)) {
  //     // requestObservable = this.onGoingRequests.get(selectorUniqueString)!;
  //     requestObservable = this.loanApplicationStateManagementService.currentLoanApplication$;
  //   } else {
  //     requestObservable = this.http.post(getLoanApplicationDetailsUrl, payload);
  //     this.onGoingRequests.set(selectorUniqueString, requestObservable);
  //     console.log('Hitting bacend from effect');
  //   }

  //   requestObservable
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((response: Partial<LoanApplicationModel>) => {
  //       if (response.status === 'SUCCESS') {
  //         this.cacheResponse.set(selectorUniqueString, response);
  //         this.onGoingRequests.delete(selectorUniqueString);
  //         this.loanApplicationStateManagementService.updateCurrentLoanApplicationState(response);
  //       }
  //     });

  //   return this.loanApplicationStateManagementService.currentLoanApplication$;
  // }
}
