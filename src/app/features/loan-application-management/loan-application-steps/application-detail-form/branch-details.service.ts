import {HttpClient} from '@angular/common/http';
import {DestroyRef, Injectable, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {environment} from '@environments/environment';
import {UserDataService} from '@core/services/user-data.service';

@Injectable()
export class BranchDetailsService implements OnDestroy {
  constructor(
        private http: HttpClient,
        private userDetails: UserDataService,
        private destroyRef: DestroyRef,
  ) {
  }

  public getBranchList() {
    const endpoints = environment.apiUrl + '/pfsvc/getBranches';
    const sessionId = this.userDetails.getUserData().sessionId;
    return this.http
      .post(endpoints, {sessionId: sessionId})
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  ngOnDestroy() {
  }
}
