import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SecureStorageService } from '../../../core/services/secure-storage.service';
import { IbUserModel } from '../../../modules/auth/models/ib-user.model';
import { ActiveLoan } from '../models/active-loans.model';

@Injectable({
  providedIn: 'root',
})
export class ActiveLoanService implements OnDestroy {
  private activeLoans: BehaviorSubject<ActiveLoan[]> = new BehaviorSubject<ActiveLoan[]>([]);

  private readonly userData: IbUserModel;

  get activeLoans$() {
    return this.activeLoans.asObservable();
  }

  constructor(private storage: SecureStorageService) {
    this.userData = JSON.parse(this.storage.get('user-data') || '{}');
    this.getActiveLoans();
  }

  getActiveLoans() {
    this.activeLoans.next(
      this.userData?.genericServiceBean?.newLoginBean?.doMobeeCustomer?.allAccList as ActiveLoan[],
    );

    // // console.log('GET All Active Loan In Active Loan Service: ', this.activeLoans.value);
    return this.activeLoans$;
  }

  ngOnDestroy() {
    // // console.log('%c Active Loan Service Destroyed', 'color: red; font-size: 20px;')
  }
}
