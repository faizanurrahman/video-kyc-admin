import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root',
})
export class SessionManagementService {
  private checkSessionUrl = environment.apiUrl + '/pfsvc/session';

  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(
    private http: HttpClient,
    private destroyRef: DestroyRef,
    private userDataService: UserDataService,
  ) {}

  async checkSession() {
    // let isSessionValid = false;
    // let userData = this.userDataService.getUserData();
    // let sessionId = userData?.sessionId || 'hdhdhdhdhdhdhd';
    // let response = (await lastValueFrom(
    //   this.http.get(this.checkSessionUrl + '/' + sessionId, {}),
    // )) as any;

    // console.log(response.sessionValid);
    // isSessionValid = response.sessionValid;
    // return isSessionValid;
    return true;

    // .pipe(takeUntilDestroyed(this.destroyRef))
    // .subscribe((res: any) => {
    //   console.log('check authentication response: ', res);

    //   this.isAuthenticated.next(res);
    // });
  }
}
