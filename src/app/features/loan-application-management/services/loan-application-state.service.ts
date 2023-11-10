import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoanApplicationStateService {
  private _currentStep: BehaviorSubject<number> = new BehaviorSubject<number>(
    1, // Initial value for the current step is 1
  );

  private _currentLoanStatus: BehaviorSubject<string> = new BehaviorSubject<string>('PENDING'); // Initial value for loan status is PENDING

  public readonly currentStep$ = this._currentStep.asObservable(); // Readonly observable for current step
  public readonly currentLoanStatus$ = this._currentLoanStatus.asObservable(); // Readonly observable for current loan status

  // Setter for current step
  set currentStep(value: number) {
    this._currentStep.next(value);
  }

  // Getter for current step
  get currentStep() {
    return this._currentStep.getValue();
  }

  // Setter for current loan status
  set currentLoanStatus(value: string) {
    this._currentLoanStatus.next(value);
    // // console.log('setting current loan status: ', value); // Optional debug log
  }

  // Getter for current loan status
  get currentLoanStatus() {
    return this._currentLoanStatus.getValue();
  }
}
