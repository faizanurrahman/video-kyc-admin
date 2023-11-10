import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndividualCountService {
  private countBS$ = new BehaviorSubject<number>(1);

  get count() {
    return this.countBS$.getValue();
  }

  set count(newCount: number) {
    this.countBS$.next(newCount);
  }
}
