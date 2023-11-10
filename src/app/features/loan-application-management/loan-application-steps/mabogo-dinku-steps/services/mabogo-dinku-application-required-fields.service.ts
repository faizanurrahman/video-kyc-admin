import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type LoanApplicationStep =
  | 'company_details'
  | 'application_details'
  | 'individual_details'
  | 'document_details';

@Injectable({
  providedIn: 'root',
})
export class MabogoDinkuApplicationRequiredFields {
  private requiredFieldsMap = new Map<LoanApplicationStep, any>();
  private hasLeftRequiredFields = new BehaviorSubject<boolean>(true);
  private requiredFieldsArray = new BehaviorSubject<{ step: LoanApplicationStep; fields: any }[]>(
    [],
  );

  public readonly hasLeftRequiredFields$ = this.hasLeftRequiredFields.asObservable();
  public readonly requiredFieldsArray$ = this.requiredFieldsArray.asObservable();

  constructor() {}

  public setRequiredFields(step: LoanApplicationStep, fields: any) {
    this.requiredFieldsMap.set(step, fields);
    // console.log('required field is set to: ' + step + ' ', fields);
    this.updateRequiredFieldsState();
  }

  public removeRequiredFields(step: LoanApplicationStep) {
    if (this.requiredFieldsMap.has(step)) {
      this.requiredFieldsMap.delete(step);
      this.updateRequiredFieldsState();
    }
  }

  private updateRequiredFieldsState() {
    this.hasLeftRequiredFields.next(this.hasEmptyRequiredFields());
    this.requiredFieldsArray.next(
      Array.from(this.requiredFieldsMap).map(([step, fields]) => ({ step, fields })),
    );
  }

  private hasEmptyRequiredFields(): boolean {
    const allSteps: LoanApplicationStep[] = [
      'application_details',
      'company_details',
      'document_details',
      'individual_details',
    ];

    return allSteps.some((step) => this.requiredFieldsMap.has(step));
  }
}
