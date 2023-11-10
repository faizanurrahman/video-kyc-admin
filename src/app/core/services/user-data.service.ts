import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IbUserModel } from '../../modules/auth/models/ib-user.model';
import { SecureStorageService } from './secure-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private readonly userData: BehaviorSubject<IbUserModel> = new BehaviorSubject<IbUserModel>(
    {} as IbUserModel,
  );

  get userData$() {
    return this.userData.asObservable();
  }

  constructor(private storage: SecureStorageService) {
    // const userData = JSON.parse(this.storage.get('user-data')) as IbUserModel;
    // this.userData.next(userData);
  }

  public getUserData() {
    // return this.userData.getValue();
    const data = (JSON.parse(this.storage.get('user-data') || '{}') || {}) as IbUserModel;

    this.userData.next(data);
    return data;
  }

  public async getSessionId() {
    const sessionId = await JSON.parse(this.storage.get('sessionId'));
    return sessionId;
    // return JSON.parse(this.storage.get('sessionId'));
  }

  public setUserData(userData: IbUserModel) {
    this.storage.set('user-data', JSON.stringify(userData));
    this.userData.next(userData);
  }

  public setSessionId(sessionId: string) {
    this.storage.set('sessionId', JSON.stringify(sessionId));
  }
}
