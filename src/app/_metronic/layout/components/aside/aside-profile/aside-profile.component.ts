import { NgIf } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SecureStorageService } from '../../../../../core/services/secure-storage.service';
import { AuthService } from '../../../../../modules/auth';
import { IbUserModel } from '../../../../../modules/auth/models/ib-user.model';
import { UserInnerComponent } from '../../../../partials/layout/extras/dropdown-inner/user-inner/user-inner.component';
import { AvatarPhotoComponent } from './avatar-photo/avatar-photo.component';

@Component({
  selector: 'app-aside-profile',
  templateUrl: './aside-profile.component.html',
  styleUrls: ['./aside-profile.component.scss'],
  standalone: true,
  imports: [AvatarPhotoComponent, NgIf, InlineSVGModule, UserInnerComponent],
})
export class AsideProfileComponent {
  userDetails: IbUserModel;
  username: string;
  bpNumber: string;

  constructor(
    private auth: AuthService,
    private storage: SecureStorageService,
    private destroyRef: DestroyRef,
  ) {
    // this.userDetails = JSON.parse(this.storage.get('user-data'));
    // this.username = this.userDetails.genericServiceBean.newLoginBean.doMobeeCustomer.custName;
    // this.bpNumber = this.userDetails.genericServiceBean.newLoginBean.doMobeeCustomer.acctPrimary;
    this.username = 'Madhuri R';
    this.bpNumber = 'Not Avaialble';
  }

  logout() {
    localStorage.clear();
    // location.reload();
    this.auth.logout();
    // this.auth.logout();
    // window.location.reload();

    setTimeout(() => {
      // document.location.reload();
    }, 1000);
  }
}
