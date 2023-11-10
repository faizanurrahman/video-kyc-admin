import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpLoaderService } from '../../../../core/services/http-loader.service';
import { LoanStatementService } from '../../../../features/loan-statements/services/loan-statement.service';
import { LoaderComponent } from '../../../../shared/ui/components/loader/loader.component';
import { MiniDateComponent } from '../../../../shared/ui/components/mini-date/mini-date.component';
import { AutoAnimateDirective } from '../../../../shared/ui/directives/dom-event-directives/auto-animate.directive';
import { PopupComponent } from '../../../../_metronic/partials/layout/modals/popup/popup.component';

export interface LoanStatement {
  ranl: string;
  docDate: string;
  docRef: string;
  docDesc: string;
  docDebit: string;
  docCredit: string;
  docBalance: string;
  loanDate?: string;
  loanMonth?: string;
  loanYear?: string;
}

@Component({
  selector: 'app-recent-loan-transactions',
  templateUrl: './recent-loan-transactions.component.html',
  styleUrls: ['./recent-loan-transactions.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgFor,
    MiniDateComponent,
    PopupComponent,
    LoaderComponent,
    AsyncPipe,
    AutoAnimateDirective,
  ],
  providers: [DecimalPipe],
})
export class RecentLoanTransactionsComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'card h-100 w-100 p-0 bg-body';

  private loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  loanStatements: LoanStatement[] = [];
  openItemStatements: LoanStatement[] = [];

  @ViewChild('openItemPopup') openItemPopup: PopupComponent;
  currentAccountNo: string | undefined = undefined;

  private subs: Subscription[] = [];

  constructor(
    private loanStatementService: LoanStatementService,
    protected loader: HttpLoaderService,
    private destroyRef: DestroyRef,
    private decimalPipe: DecimalPipe,
  ) {}

  ngOnInit() {
    this.getCurrentLoanStatement();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  refreshLoanStatement() {
    this.loading$.next(true);
    this.loanStatementService.getLoanStatementByLoanNumber(this.currentAccountNo!);
  }

  getCurrentLoanStatement() {
    this.loading$.next(true);
    this.loanStatementService.currentLoanStatement$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.currentAccountNo = this.loanStatementService.currentAccountNo;

        // // console.log('current loan statment value: ', value);
        if (value === undefined || value === null) {
          this.loanStatements = [];
          return;
        }
        this.loanStatements = value?.data?.STATEMENT_RESP?.etZloanOutInfSt?.item || [];
        this.openItemStatements = value?.data?.STATEMENT_RESP?.etZloanOutSt?.item || [];

        // // console.log('loan statements', this.loanStatements);

        // setting date and month and year
        this.loanStatements.forEach((statement) => {
          const date = new Date(statement.docDate);
          statement.loanDate = date.getDate().toString();
          statement.loanMonth = (date.getMonth() + 1).toString();
          statement.loanYear = date.getFullYear().toString();
        });

        this.openItemStatements.forEach((statement) => {
          const date = new Date(statement.docDate);
          statement.loanDate = date.getDate().toString();
          statement.loanMonth = (date.getMonth() + 1).toString();
          statement.loanYear = date.getFullYear().toString();
        });

        this.loading$.next(false);
      });
  }

  openPopupOpenItems() {
    this.openItemPopup.open({
      config: {
        container: 'body',
        backdrop: 'static',
        scrollable: true,
        fullscreen: false,
        centered: true,
        backdropClass: 'custom-backdrop',
        windowClass: 'custom-window',
        modalDialogClass: '',
      },
      data: {
        title: 'Open Items',
        showFooter: false,
      },
    });
  }

  getDecimalValue(value: string) {
    const numericValue = parseFloat(value.replace(/,/g, '')); // Remove existing commas
    return this.decimalPipe.transform(numericValue, '1.2')?.toString() || '';
  }
}
