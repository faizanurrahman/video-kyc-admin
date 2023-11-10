import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../../environments/environment';
import { UserDataService } from '../../../../core/services/user-data.service';

@Injectable()
export class FeedbackDepartmentService implements OnDestroy {
  constructor(
    private http: HttpClient,
    private userDataService: UserDataService, // private http: HttpClient, // private userDataService: UserDataService,

    private destroyRef: DestroyRef,
  ) {}

  getFeedbackDepartements() {
    const endpoint = environment.apiUrl + '/pfsvc/getDepartments';
    const sessionId = this.userDataService.getUserData().sessionId;

    return this.http
      .post(endpoint, { sessionId: sessionId })
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  ngOnDestroy() {}
}
