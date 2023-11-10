import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { ChatwootService } from '../../../../core/services/chatwoot.service';
import { UserDataService } from '../../../../core/services/user-data.service';
import { IbUserModel } from '../../../../modules/auth/models/ib-user.model';

interface ActiveLoan {
  accountNo: string;
  balance: string;
  loanAmount: string;
  arrears: string;
  status: string;

  backgroundColor?: string;
  backgroundGradient?: string;
}

interface ChatwootSettings {
  hideMessageBubble?: boolean;
  position?: 'left' | 'right';
  locale?: 'en';
  useBrowserLanguage?: boolean;
  type?: 'standard' | 'expanded_bubble';
  darkMode?: 'light' | 'auto';
  launcherTitle?: string;
}
export interface ChatWootWindow extends Window {
  $chatwoot: any;
  chatwootSettings: ChatwootSettings;
}

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss'],
  standalone: true,
  imports: [],
})
export class DashboardV2Component implements OnInit, OnDestroy {
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
    this.userActiveLoans =
      this.loggedInUserData.genericServiceBean.newLoginBean.doMobeeCustomer.allAccList || [];
    // // console.log('user all active loans', this.userActiveLoans);
    // this.chatwootService.initChatwoot();
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
