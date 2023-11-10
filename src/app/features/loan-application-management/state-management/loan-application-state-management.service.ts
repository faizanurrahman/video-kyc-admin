import { Injectable } from '@angular/core';
import isEqual from 'lodash-es/isEqual';
import { BehaviorSubject } from 'rxjs';
import { LoanApplicationModel } from '../models/loan-application.model';

interface Application {
  applicationId: string;
  loanApplicationType: string;
  productType: string;
  sectorType: string;
  comments?: string;
  createdOn: string;
  updatedOn: string;
  status: string;
}

interface Data {
  applications: Application[];
}

export interface IAllLoanApplications {
  status: string;
  statusCode: string;
  statusDesc: string;
  decisionPageRequired: boolean;
  data: Data;
}

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationStateManagementService {
  // ================= INITIAL STATE ==============
  private allLoanApplication: BehaviorSubject<Partial<IAllLoanApplications>> = new BehaviorSubject(
    {},
  );
  private currentLoanApplication: BehaviorSubject<Partial<LoanApplicationModel>> =
    new BehaviorSubject({});

  // ================ SELECTORS =============
  public readonly allLoanApplication$ = this.allLoanApplication.asObservable();
  public readonly currentLoanApplication$ = this.currentLoanApplication.asObservable();

  // ================= ACTIONS ============
  updateAllLoanApplicationState(newState: Partial<IAllLoanApplications>) {
    const oldState = this.allLoanApplication.value;
    const isDataChanged = !isEqual(oldState, newState);
    if (isDataChanged) {
      this.allLoanApplication.next(newState);
    }
  }
  updateCurrentLoanApplicationState(newState: Partial<LoanApplicationModel>) {
    const oldState = this.currentLoanApplication.value;
    const isDataChanged = !isEqual(oldState, newState);
    if (isDataChanged) {
      this.currentLoanApplication.next(newState);
    }
  }
}
