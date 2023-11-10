import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface IAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postCode: string;
}

export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: IAddress;
}

export interface IWorkInfo {
  company: string;
  position: string;
  address: IAddress;
}

export interface ILoanInfo {
  loanAmount: number;
  loanPurpose: string;
  loanTerm: number;
}

export type DocumentType = 'passport' | 'id-card' | 'driver-license';
export interface IDocument {
  name: string;
  type: DocumentType;
  size: number;
  url: string;
}

export interface ILoanApplication {
  personalInfo: IPersonalInfo;
  workInfo: IWorkInfo;
  loanInfo: ILoanInfo;
  documents: IDocument[];
}

export const inits: Partial<ILoanApplication> = {};

@Component({
  selector: 'app-loan-application',
  templateUrl: './loan-application.component.html',
  styleUrls: ['./loan-application.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LoanApplicationComponent implements OnInit, OnDestroy {
  formsCount = 5;

  loanApplicationBS$ = new BehaviorSubject<ILoanApplication>(<ILoanApplication>inits);
  currentStepBS$ = new BehaviorSubject<number>(1);
  isCurrentFormValidBS$ = new BehaviorSubject<boolean>(false);

  private subs: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {}

  updateLoanApplication = (part: Partial<ILoanApplication>, isFormValid: boolean) => {
    const currentLoanApplication = this.loanApplicationBS$.value;
    const updatedLoanApplication = { ...currentLoanApplication, ...part };
    this.loanApplicationBS$.next(updatedLoanApplication);
    this.isCurrentFormValidBS$.next(isFormValid);
  };

  nextStep() {
    const nextStep = this.currentStepBS$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    this.currentStepBS$.next(nextStep);
  }

  prevStep() {
    const prevStep = this.currentStepBS$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStepBS$.next(prevStep);
  }

  getStepClass(step: number) {
    const currentStep = this.currentStepBS$.value;
    if (step < currentStep) {
      return 'completed';
    } else if (step === currentStep) {
      return 'current';
    }
  }

  ngOnDestroy() {
    this.subs.forEach(sb => sb.unsubscribe());
  }
}
