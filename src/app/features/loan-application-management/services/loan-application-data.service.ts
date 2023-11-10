import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {UserDataService} from '@core/services/user-data.service';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {IbUserModel} from '@auth/models/ib-user.model';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationDataService implements OnDestroy {
  private userDetails: IbUserModel;

  // Application Data

  constructor(private http: HttpClient, private userDataService: UserDataService) {
    this.userDetails = this.userDataService.getUserData();
  }

  initLoanApplication(loanType: string, sector: string, productType: string) {
    const payload = {
      loanApplicationType: loanType,
      productType: productType,
      sectorType: sector,
      userName: this.userDetails.genericServiceBean.newLoginBean.loginId,
      sessionId: this.userDetails.sessionId,
    };

    const loanCreateUrl = environment.apiUrl + '/pfsvc/loan/create';

    return this.http.post(loanCreateUrl, payload) as Observable<any>;
  }

  ngOnDestroy(): void {
  }
}
