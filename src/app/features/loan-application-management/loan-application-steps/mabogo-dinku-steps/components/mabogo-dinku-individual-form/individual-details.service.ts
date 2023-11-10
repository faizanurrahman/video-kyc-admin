import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable } from 'rxjs';
import { IndividualDetailsModel } from '../../../individual-form/individual-form.model';
export interface IndividualStateModel {
  numberOfIndividual?: number;
  individualData?: Partial<IndividualDetailsModel>[];
}
@Injectable({
  providedIn: 'root',
})
export class IndividualDetailsService {
  // Initial State
  private individualState: IndividualStateModel = {
    numberOfIndividual: 0,
    individualData: [],
  };

  private individualStateBS = new BehaviorSubject<IndividualStateModel>(this.individualState);
  public individualState$ = this.individualStateBS.asObservable();

  public get individualCount() {
    let currentValue = this.individualStateBS.getValue();
    let count = currentValue.numberOfIndividual!;
    return count;
  }
  public get individualCount$() {
    return this.individualState$.pipe(map((state) => state?.numberOfIndividual));
  }

  public set individualCount(count: number) {
    this.individualState = { ...this.individualState, numberOfIndividual: count };
    this.individualStateBS.next(this.individualState);
  }

  public getIndvidualCount(): Observable<number | undefined> {
    return this.individualState$.pipe(map((state) => state?.numberOfIndividual));
  }

  public setIndividualCount(count: number) {
    this.individualState = { ...this.individualState, numberOfIndividual: count };
    this.individualStateBS.next(this.individualState);
  }

  public getIndvidualData(): Observable<any> {
    return this.individualState$.pipe(map((state) => state.individualData));
  }

  public setIndividualData(individualData: Partial<IndividualDetailsModel>[]) {
    this.individualState = { ...this.individualState, individualData: individualData };
    this.individualStateBS.next(this.individualState);
  }

  constructor() {}
}
