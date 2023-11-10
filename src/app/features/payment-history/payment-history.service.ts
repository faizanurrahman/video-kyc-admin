import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDataService } from '../../core/services/user-data.service';
import { PaymentHistoryModel } from './payment-history.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentHistoryService {
  private paymentHistorySubject = new Subject<PaymentHistoryModel>();
  public readonly paymentHistory$ = this.paymentHistorySubject.asObservable();

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private destoryRef: DestroyRef,
  ) {}

  getAllPayments() {
    const url = environment.apiUrl + '/accsvc/paymentHistory';
    const payload = {
      userId: this.userDataService.getUserData()?.genericServiceBean?.newLoginBean?.loginId || '',
      sessionId: this.userDataService.getUserData()?.sessionId,
    };

    return this.http
      .post<any>(url, payload)
      .pipe(takeUntilDestroyed(this.destoryRef))
      .pipe(
        map((res: any) => {
          let paymentHistory = res.data.paymentHistory;
          this.paymentHistorySubject.next(paymentHistory);
          return paymentHistory;
        }),
      );
  }
}
