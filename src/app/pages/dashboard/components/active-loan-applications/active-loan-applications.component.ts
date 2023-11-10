import { NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { IbUserModel } from '@auth/models/ib-user.model';
import { UserDataService } from '@core/services/user-data.service';
import { AutoAnimateDirective } from '../../../../shared/ui/directives/dom-event-directives/auto-animate.directive';

@Component({
  selector: 'app-active-loan-applications',
  templateUrl: './active-loan-applications.component.html',
  styleUrls: ['./active-loan-applications.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, AutoAnimateDirective],
})
export class ActiveLoanApplicationsComponent implements OnInit {
  @HostBinding('class') classes = 'card h-100 w-100 p-0 bg-body';

  userData: IbUserModel;
  activeLoanData: any = [];

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.userData = this.userDataService.getUserData();
    // const loanApps =
    //   this.userData.genericServiceBean.newLoginBean.doMobeeCustomer
    //     .dataSourceList.LOANAPPS;
    const loanAppStatus =
      this.userData.genericServiceBean.newLoginBean.doMobeeCustomer.dataSourceList?.LOANAPPSTATUS;

    if (loanAppStatus && loanAppStatus.length > 0) {
      this.activeLoanData = loanAppStatus;
    }

    // this.cdr.detectChanges();

    // const loanAppsWithStatus = loanApps.map((loanApp: any) => {
    //   const matchingStatus = loanAppStatus.find(
    //     (status: any) => status.id === loanApp.id
    //   );
    //   return {
    //     id: loanApp.id,
    //     displayName: loanApp.displayName,
    //     status: matchingStatus?.displayName,
    //   };
    // });

    // const activeLoansPromis = lastValueFrom(
    //   this.loanApplicationService.getAllLoanApplication()
    // );
    // activeLoansPromis.then((res: any) => {
    //   // // console.log(res);
    //   const activeLoans = res.data.applications;
    //   // this.activeLoanData = activeLoans;
    // });
  }
}
