import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ChangePasswordRequestBean, ChangePasswordResponseBean} from '@shared/change-password/change-password.interface';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordHttpService {
  private changePasswordUrl = environment.apiUrl + '/pfsvc/changePwd';

  constructor(private http: HttpClient) {
  }

  public changePassword(changePasswordPayload: ChangePasswordRequestBean) {
    return this.http.post<ChangePasswordResponseBean>(
      this.changePasswordUrl,
      changePasswordPayload,
    );
  }
}
