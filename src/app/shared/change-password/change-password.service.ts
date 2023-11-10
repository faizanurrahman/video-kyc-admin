import { Injectable } from '@angular/core';
import { ChangePasswordRequestBean } from '@shared/change-password/change-password.interface';
import { map } from 'rxjs';
import { UserDataService } from '../../core/services/user-data.service';
import { IbUserModel } from '../../modules/auth/models/ib-user.model';
import { ChangePasswordHttpService } from './change-password-http.service';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  userDetails: IbUserModel;

  constructor(
    private changePasswordHttp: ChangePasswordHttpService,
    private userData: UserDataService,
  ) {
    this.userDetails = this.userData.getUserData();
  }

  changePassword(formData: any) {
    // // console.log('form data; ****************************', formData);
    const payload: ChangePasswordRequestBean = {
      data: {
        CPIN_CURRENTPIN: formData.currentPassword,
        CPIN_NEWPIN: formData.newPassword,
        CPIN_RENEWPIN: formData.reNewPassword,
      },
      newLoginBean: {
        loginId: this.userDetails.genericServiceBean.newLoginBean.loginId,
        transactionId: '24012023080821984256712345993',
      },
      requestId: '25671234599324012023080821984',
      serviceName: 'IB_CHANGE_PASSWORD',
      sessionId: this.userDetails.sessionId,
    };

    return this.changePasswordHttp.changePassword(payload).pipe(
      map((res) => {
        return {
          status: res.status,
          statusCode: res.statusCode,
          statusMessage: res.statusDesc,
          data: res.data,
        };
      }),
    );
  }
}
