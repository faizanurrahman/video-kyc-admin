import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ChatwootService } from '../../../../core/services/chatwoot.service';
import { UserDataService } from '../../../../core/services/user-data.service';
import { ActiveLoan } from '../../../../features/loan-statements/models/active-loans.model';
import { IbUserModel } from '../../../../modules/auth/models/ib-user.model';

@Component({
  selector: 'app-dashboard-v3',
  templateUrl: './dashboard-v3.component.html',
  styleUrls: ['./dashboard-v3.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DashboardV3Component implements OnInit, OnDestroy {
  loggedInUserData: IbUserModel;
  userActiveLoans: ActiveLoan[];

  constructor(
    private userDataService: UserDataService,
    private cdr: ChangeDetectorRef,
    private chatwootService: ChatwootService,
  ) {
    // this.loggedInUserData = JSON.parse(
    //   this.crypto.decrypt(this.storage.get('user-data'))
    // ) as IbUserModel;

    // console.log('dashboard created');

    this.loggedInUserData = this.userDataService.getUserData();
    // // console.log('dashboard logged in user data', this.loggedInUserData);
    try {
      this.userActiveLoans =
        this.loggedInUserData.genericServiceBean.newLoginBean.doMobeeCustomer.allAccList || [];
    } catch {
      this.userActiveLoans = [];
    }

    this.chatwootService.setAuthorizedUser();
    this.chatwootService.showChatwoot();
  }

  ngOnInit() {}

  // todo: chat woot integration and customisation
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // console.log('dashboard destroyed');
    this.chatwootService.hideChatwoot();
  }
}
