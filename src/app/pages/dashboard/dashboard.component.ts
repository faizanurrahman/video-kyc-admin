import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LottieAnimationComponent } from '@shared/ui/components/lottie-animation/lottie-animation.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ChatwootService } from '../../core/services/chatwoot.service';
import { SessionManagementService } from '../../core/services/session-management.service';
import { UserDataService } from '../../core/services/user-data.service';
import { HorizontalWizardComponent } from '../../features/loan-application-management/components/horizontal-wizard/horizontal-wizard.component';
import { IbUserModel } from '../../modules/auth/models/ib-user.model';
import { CarouselComponent } from '../../shared/ui/components/carousel/carousel.component';
import { ScrollChangeDirective } from '../../shared/ui/directives/dom-event-directives/scroll-change.directive';
import { ActiveLoanApplicationsComponent } from './components/active-loan-applications/active-loan-applications.component';
import { ApplyNewLoanApplicationComponent } from './components/apply-new-loan-application/apply-new-loan-application.component';
import { MyLoanCardsComponent } from './components/my-loan-cards/my-loan-cards.component';
import { OfferCarouselComponent } from './components/offer-carousel/offer-carousel.component';
import { RecentLoanTransactionsComponent } from './components/recent-loan-transactions/recent-loan-transactions.component';
import { RecentLoansComponent } from './components/recent-loans/recent-loans.component';
import { ResumeApplicationComponent } from './components/resume-application/resume-application.component';

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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    OfferCarouselComponent,
    MyLoanCardsComponent,
    RecentLoanTransactionsComponent,
    RecentLoansComponent,
    ApplyNewLoanApplicationComponent,
    ResumeApplicationComponent,
    ActiveLoanApplicationsComponent,
    CarouselComponent,
    HorizontalWizardComponent,
    ScrollChangeDirective,
    LottieAnimationComponent,
    InlineSVGModule,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  loggedInUserData: IbUserModel;
  userActiveLoans: ActiveLoan[];

  constructor(
    private userDataService: UserDataService,
    private cdr: ChangeDetectorRef,
    private chatwootService: ChatwootService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private sessionService: SessionManagementService,
  ) {
    // this.loggedInUserData = JSON.parse(
    //   this.crypto.decrypt(this.storage.get('user-data'))
    // ) as IbUserModel;

    // console.log('dashboard created');

    // this.sessionService.checkSession();

    // this.loggedInUserData = this.userDataService.getUserData();
    // // // console.log('dashboard logged in user data', this.loggedInUserData);
    // this.userActiveLoans =
    //   this.loggedInUserData.genericServiceBean.newLoginBean.doMobeeCustomer.allAccList || [];
    // // // console.log('user all active loans', this.userActiveLoans);
    // // this.chatwootService.initChatwoot();
    // setTimeout(() => {
    //   this.chatwootService.setAuthorizedUser();
    //   this.chatwootService.showChatwoot();
    // }, 3000);

    // this.router.navigate(['dashboard'], {});
    location.replace('/#/dashboard');
  }

  ngOnInit() {}

  // todo: chat woot integration and customisation
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // console.log('dashboard destroyed');
    // this.chatwootService.hideChatwoot();
  }
}
