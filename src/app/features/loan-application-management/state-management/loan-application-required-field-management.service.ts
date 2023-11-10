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
export class LoanApplicationRequiredFieldService {
  public loanApplicationRequiredFields = new Map<LoanApplicationStep, any>();

  private loanApplicationHasLeftRequiredField = new BehaviorSubject<boolean>(true);
  public readonly loanApplicationHasLeftRequiredField$ =
    this.loanApplicationHasLeftRequiredField.asObservable();

  private requiredFieldsBS = new BehaviorSubject<{ [key: string]: any }[]>([]);

  public readonly requiredFields$ = this.requiredFieldsBS.asObservable();

  constructor() {}
  public setRequiredFileds(key: LoanApplicationStep, value: any) {
    this.loanApplicationRequiredFields.set(key, value);
    this.loanApplicationHasLeftRequiredField.next(true);
    this.requiredFieldsBS.next(mapToArrayOfObjects(this.loanApplicationRequiredFields));
  }

  public removeRequiredFields(key: LoanApplicationStep) {
    if (this.loanApplicationRequiredFields.has(key)) {
      this.loanApplicationRequiredFields.delete(key);
      this.loanApplicationHasLeftRequiredField.next(this.isRequiredFieldsHaveValue());
      this.requiredFieldsBS.next(mapToArrayOfObjects(this.loanApplicationRequiredFields));
      return;
    }
  }

  public isRequiredFieldsHaveValue(): boolean {
    let keys: LoanApplicationStep[] = [
      'application_details',
      'company_details',
      'document_details',
      'individual_details',
    ];
    let exist = false;

    keys.forEach((key: LoanApplicationStep) => {
      if (this.loanApplicationRequiredFields.has(key)) {
        exist = true;
      }
    });

    return exist;
  }
}

function mapToArrayOfObjects<K, V>(map: Map<K, V>): Array<{ key: K; value: V }> {
  const arrayOfObjects: Array<{ key: K; value: V }> = [];

  for (const [key, value] of map.entries()) {
    arrayOfObjects.push({ key, value });
  }

  return arrayOfObjects;
}
