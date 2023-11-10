import { Injectable } from '@angular/core';
import isEqual from 'lodash-es/isEqual';
import { BehaviorSubject } from 'rxjs';
import { ActiveLoan } from '../models/active-loans.model';
import { LoanStatementResponseModel } from '../models/loan-statement-response.model';

export class LoanStatementStateModel {
  contractNumber: string;
  statements: Partial<LoanStatementResponseModel>;
}

export class ActiveLoanStateModel {}

const loanStatementInitialState: Partial<LoanStatementStateModel> = {
  contractNumber: '',
  statements: {},
};

const activeLoanInitialState: Partial<ActiveLoan>[] = [];

@Injectable({
  providedIn: 'root',
})
export class LoanStatementStateService {
  // =========== INITIAL STATE ============
  private loanStatementState: BehaviorSubject<Partial<LoanStatementStateModel>> =
    new BehaviorSubject<Partial<LoanStatementStateModel>>(loanStatementInitialState);

  private activeLoanState: BehaviorSubject<Partial<ActiveLoan>[]> = new BehaviorSubject<
    Partial<ActiveLoan>[]
  >(activeLoanInitialState);

  // =========== SELECTORS ====================

  public readonly loanStatementState$ = this.loanStatementState.asObservable();
  public readonly activeLoanState$ = this.loanStatementState.asObservable();

  // =============== ACTIONS ================

  updateLoanStatementState(newState: Partial<LoanStatementStateModel>) {
    const oldState = this.loanStatementState.value;
    const isDataChanged = !isEqual(oldState, newState);

    if (isDataChanged) {
      this.loanStatementState.next({ ...this.loanStatementState.value, ...newState });
      // prevent additional re-rendering of component while ensuring latest data
    }
  }

  clearLoanStatementState() {
    this.loanStatementState.next(loanStatementInitialState);
  }

  updateActiveLoanState(newState: Partial<ActiveLoan>[]) {
    const oldState = this.activeLoanState.value;
    const isDataChanged = !isEqual(oldState, newState);

    if (isDataChanged) {
      // this.activeLoanState.next([...oldState, ...newState])
      this.activeLoanState.next(newState);
    }
  }

  clearActiveLoanState() {
    this.activeLoanState.next(activeLoanInitialState);
  }
}
