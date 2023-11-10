import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  MabogoDinkuApplicationDataModel,
  MabogoDinkuApplicationModel,
} from '../models/mabogo-dinku-application-model';

@Injectable({
  providedIn: 'root',
})
export class MabogoDinkuApplicationStateService {
  private mabogoDinkuFormDataBS = new BehaviorSubject<MabogoDinkuApplicationModel | null>(null);
  public mabogoDinkuFormData$ = this.mabogoDinkuFormDataBS.asObservable();

  public getMabogoDinkuFormData() {
    return this.mabogoDinkuFormDataBS.getValue();
  }

  public setMabogoDinkuFormData(latestData: MabogoDinkuApplicationDataModel) {
    const currentData = this.getMabogoDinkuFormData();
    if (!currentData) return;

    currentData.data.appDetails = { ...currentData.data.appDetails, ...latestData };
    this.mabogoDinkuFormDataBS.next(currentData);
  }
}
