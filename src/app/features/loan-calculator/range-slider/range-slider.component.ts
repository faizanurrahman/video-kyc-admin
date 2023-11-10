import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
// @ts-nochecks
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { SecureStorageService } from '../../../core/services/secure-storage.service';
import { IbUserModel } from '../../../modules/auth/models/ib-user.model';
import {
  PopupComponent,
  PopupConfig,
} from '../../../_metronic/partials/layout/modals/popup/popup.component';
import { LoanRatesComponent } from '../loan-rates/loan-rates.component';
import { MyNouisliderComponent } from '../my-nouislider/my-nouislider.component';

Chart.register(...registerables);

interface BreakDownInterestData {
  paymentNo: number;
  emi: string;
  interestPaid: string;
  principalPaid: string;
  newBalance: string;
}

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DecimalPipe],
  standalone: true,
  imports: [MyNouisliderComponent, NgIf, PopupComponent, NgFor, LoanRatesComponent, CurrencyPipe],
})
export class RangeSliderComponent implements AfterViewInit, OnInit {
  private subs: Subscription[] = [];
  private loanCalculatedUrl = environment.apiUrl + '/pfsvc/loanCalculator';
  private userData: IbUserModel;

  // may be unused
  @ViewChild('amountSlider') amountSlider: ElementRef<any>;
  @ViewChild('termsLengthSlider') termsLengthSlider: ElementRef<any>;
  @ViewChild('interestSlider') interestSlider: ElementRef<any>;

  P: number;
  R: number;
  N: number;
  pie: Chart;
  line: Chart;

  protected popupConfig: PopupConfig = {
    data: {
      title: 'Breakdown of Interest',
    },
  };
  @ViewChild('modal', { static: false }) modal: PopupComponent;

  protected loanRatesPopupConfig: PopupConfig = {
    data: {
      title: 'Loan Rates',
    },
  };
  @ViewChild('loanRatesModal', { static: false }) loanRatesModal: PopupComponent;

  public breakdownInterestData: BreakDownInterestData[] = [];
  public breakdownMessage: string;

  public showCalculateButton: boolean = true;

  public disclaimerHidden: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private storage: SecureStorageService,
    private decimalPipe: DecimalPipe,
    private destroyRef: DestroyRef,
  ) {
    this.userData = JSON.parse(this.storage.get('user-data')) as IbUserModel;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // Initialize everything
    this.initialize();
  }

  amountChanged(value: any) {
    // // console.log('amount value: ', value);
    this.P = parseFloat(value);
    this.showCalculateButton = true;
    this.updateCalculatedLoanDetails();
  }

  termsLengthChanged(value: any) {
    // // console.log('terms length value: ', value);
    this.N = parseFloat(value);
    this.showCalculateButton = true;
    this.updateCalculatedLoanDetails();
  }

  interestChanged(value: any) {
    // // console.log('interest changed: ', value);
    this.R = parseFloat(value);
    this.showCalculateButton = true;
    this.updateCalculatedLoanDetails();
  }

  // Need to integrate this with the API
  private async getLoanCalculatedData() {
    let totalInterest = 0;
    let yearlyInterest: number[] = [];
    let yearlyPrincipal: number[] = [];
    let years: number[] = [];
    let year = 1;
    // let counter = 0;
    let principal = 0;
    // let interes = 0;

    const username = this.userData.genericServiceBean.newLoginBean.loginId;
    const sessionId = this.userData.sessionId;

    const payload = {
      newLoginBean: {
        loginId: username,
        transactionId: '123test',
      },
      serviceName: 'LOAN_CALCULATOR',
      requestId: '123test',
      sessionId: sessionId,
      data: {
        LOAN_TERMS: (this.N / 12).toFixed(0).toString(), // fix: now N is in months
        LOAN_AMOUNT: this.P.toString(),
        LOAN_INTEREST: this.R.toString(),
      },
    };
    this.subs.push(
      this.http
        .post(this.loanCalculatedUrl, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res: any) => {
          if (res.status === 'FAILED') {
            this.breakdownInterestData = [];
            this.breakdownMessage = res.msg;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res.data.msg,
              heightAuto: false,
            });
            this.cdr.detectChanges();
            return;
          }

          const calculatedData = res.data;
          const amount = calculatedData.LOAN_AMOUNT;
          const emi = calculatedData.LOAN_EMI;

          this.P = amount;

          let opts: any = { style: 'decimal', currency: 'USD' };

          const breakDownData =
            calculatedData.LOAN_AMORTIZATION_SCHEDULE as BreakDownInterestData[];
          this.breakdownInterestData = breakDownData;
          this.breakdownMessage = calculatedData.msg;
          breakDownData.forEach((data: BreakDownInterestData, index: number) => {
            const interestPaid = data.interestPaid;
            const principalPaid = data.principalPaid;

            totalInterest += parseFloat(interestPaid);
            principal += parseFloat(principalPaid);

            if ((index + 1) % 12 === 0) {
              years.push(year++);
              yearlyInterest.push(parseFloat(totalInterest.toString()));
              yearlyPrincipal.push(parseFloat(principal.toString()));
            }
          });

          document.querySelector('#cp')!.innerHTML =
            'P ' + parseFloat(this.P.toString()).toLocaleString('en-US', opts);

          document.querySelector('#ci')!.innerHTML =
            'P ' + parseFloat(totalInterest.toString()).toLocaleString('en-US', opts);

          document.querySelector('#ct')!.innerHTML =
            'P ' +
            parseFloat(
              (parseFloat(this.P.toString()) + parseFloat(totalInterest.toString())).toString(),
            ).toLocaleString('en-US', opts);

          document.querySelector('#price')!.innerHTML =
            'P ' + parseFloat(emi.toString()).toLocaleString('en-US', opts);

          this.pie.data.datasets[0].data[0] = this.P;
          this.pie.data.datasets[0].data[1] = totalInterest;
          this.pie.update();

          this.cdr.detectChanges();
        }),
    );

    return totalInterest;
  }

  private calculateLoanDetails(p: number, r: number, emi: number): number {
    /*
    p: principal
    r: rate of interest
    emi: monthly emi
  */
    let totalInterest = 0;
    let yearlyInterest: number[] = [];
    let yearPrincipal: number[] = [];
    let years: number[] = [];
    let year = 1;
    let counter = 0;
    let principal = 0;
    let interes = 0;
    while (p > 0) {
      let interest = parseFloat(p.toString()) * parseFloat(r.toString());
      p = parseFloat(p.toString()) - (parseFloat(emi.toString()) - interest);
      totalInterest += interest;
      principal += parseFloat(emi.toString()) - interest;
      interes += interest;
      counter++;
      if (counter === 12) {
        years.push(year++);
        yearlyInterest.push(parseInt(interes.toString()));
        yearPrincipal.push(parseInt(principal.toString()));
        counter = 0;
      }
    }
    // this.line.data.datasets[0].data = yearPrincipal;
    // this.line.data.datasets[1].data = yearlyInterest;
    // this.line.data.labels = years;
    return totalInterest;
  }

  public calculateLoan() {
    if (this.N && this.R && this.P) {
      // this.displayDetails();
      this.getLoanCalculatedData().then((r) => {
        this.showCalculateButton = false;
      }); // // console.log(r));
    }
  }

  // display details
  private displayDetails(): void {
    // // console.log('this.P = ', this.P);
    // // console.log('this.R = ', this.R);
    // // console.log('this.N = ', this.N);
    let r: number = parseFloat(this.R.toString()) / 1200;
    let n: number = parseFloat(this.N.toString()) * 12;

    let num: number = parseFloat(this.P.toString()) * r * Math.pow(1 + r, n);
    let denom: number = Math.pow(1 + r, n) - 1;
    let emi: number = parseFloat(num.toString()) / parseFloat(denom.toString());

    let payabaleInterest: number = this.calculateLoanDetails(this.P, r, emi);

    let opts: any = { style: 'decimal', currency: 'USD' };

    this.updateCalculatedLoanDetails(emi, payabaleInterest, opts);

    this.pie.data.datasets[0].data[0] = this.P;
    this.pie.data.datasets[0].data[1] = payabaleInterest;
    this.pie.update();
    // this.line.update();
    // // console.log('pie update, line update');
  }

  private updateCalculatedLoanDetails(
    emi: any = 0,
    payabaleInterest: any = 0,
    opts: any = { style: 'decimal', currency: 'USD' },
  ) {
    let amount = this.P.toString();
    let intreset = payabaleInterest;

    if (this.showCalculateButton) {
      amount = '0';
    }

    document.querySelector('#cp')!.innerHTML =
      'P ' + parseFloat(amount).toLocaleString('en-US', opts);

    document.querySelector('#ci')!.innerHTML =
      'P ' + parseFloat(intreset).toLocaleString('en-US', opts);

    document.querySelector('#ct')!.innerHTML =
      'P ' +
      parseFloat((parseFloat(amount) + parseFloat(intreset)).toString()).toLocaleString(
        'en-US',
        opts,
      );

    document.querySelector('#price')!.innerHTML =
      'P ' + parseFloat(emi.toString()).toLocaleString('en-US', opts);
  }

  private initialize(): void {
    // @ts-ignore
    this.pie = new Chart(document.getElementById('pieChart'), {
      type: 'doughnut',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [
          {
            label: 'Loan Breakup',
            data: [0, 0],
            backgroundColor: ['#2e3246', '#340303'],
            hoverOffset: 50,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Payment Breakup',
          },
        },
      },
    });

    this.displayDetails();
    this.updateCalculatedLoanDetails(); // added extra
  }

  public openLoanBreakdownModal() {
    this.modal
      .open({
        data: {
          title: 'Breakdown of Loan Interest',
          onClose: () => {
            // // console.log('close loan breaking modal');
            return true;
          },
          onDismiss: () => {
            // // console.log('dismiss loan breaking modal');
            return true;
          },

          showFooter: false,
          showHeader: true,
        },
        config: {
          centered: true,
          backdrop: 'static',
          keyboard: false,
          fullscreen: false,
          backdropClass: 'custom-backdrop',
          modalDialogClass: 'custom-dialog',
          windowClass: 'custom-window',
          size: 'lg',
          scrollable: true,
          container: 'body',
        },
      })
      .then((result: any) => {
        // // console.log('result', result);
      });
    // // console.log('open loan breaking modal');
  }

  public openLoanRatesModal() {
    this.loanRatesModal.open({
      data: {
        title: 'Loan Rates',
        showFooter: false,
        showHeader: true,
      },
      config: {
        centered: true,
        backdrop: 'static',
        keyboard: false,
        fullscreen: false,
        backdropClass: 'custom-backdrop',
        modalDialogClass: 'custom-dialog',
        windowClass: 'custom-window',
        size: 'lg',
        scrollable: true,
        container: 'body',
      },
    });
  }

  formatNumber(input: string) {
    const numericValue = parseFloat(input.replace(/,/g, '')); // Remove existing commas
    return this.decimalPipe.transform(numericValue, '1.2')?.toString() || '';
  }
}
