import { Injectable } from '@angular/core';
import { SecureStorageService } from '../../../../core/services/secure-storage.service';

@Injectable({
  providedIn: 'root',
})
export class IndividualCountService {
  private _individualCount: number = 1;

  constructor(private storateService: SecureStorageService) {}

  get individualCount(): number {
    return this._individualCount;
  }

  set individualCount(value: number) {
    this._individualCount = value;
    // this.storateService.set('individualCount', this._individualCount);
  }
}
