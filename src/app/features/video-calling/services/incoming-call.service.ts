import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncomingCallService {
  private incomingCallBS = new BehaviorSubject<any>(false);
  readonly incomingCall$ = this.incomingCallBS.asObservable();

  constructor() {
    setTimeout(() => {
      this.setIncomingCalling(true);
    }, 3000);
  }

  public setIncomingCalling(status: boolean) {
    this.incomingCallBS.next(status);
  }
}
