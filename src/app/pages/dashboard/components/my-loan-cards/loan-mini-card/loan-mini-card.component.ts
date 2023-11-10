import { DecimalPipe, NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import Swal from 'sweetalert2';
import { LoanStatementResponseModel } from '../../../../../features/loan-statements/models/loan-statement-response.model';
import { LoanStatement } from '../../../../../features/loan-statements/models/loan-statements.model';
import { LoanStatementService } from '../../../../../features/loan-statements/services/loan-statement.service';
import { ClickableDirective } from '../../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { LoanAdditionalDetailsComponent } from '../loan-additional-details/loan-additional-details.component';

@Component({
  selector: 'app-loan-mini-card',
  templateUrl: './loan-mini-card.component.html',
  styleUrls: ['./loan-mini-card.component.scss'],
  providers: [DecimalPipe],
  standalone: true,
  imports: [NgClass, NgStyle, NgIf, LoanAdditionalDetailsComponent, ClickableDirective],
})
export class LoanMiniCardComponent implements OnInit, OnChanges {
  // @Input('loanNumber') loanNumber: string;

  // @Input('loanType') loanType: string;
  // @Input('loanDueDate') loanDueDate: Date;

  @Input('bgColor') bgColor: string = '';

  @Input('backgroundColor') backgroundColor: string = '';

  @Input('backgroundGradient') backgroundGradient: string = '';

  backgroundImage = '/assets/media/icons/card-glass-effect.png';

  @Input('loanAmount') loanAmount: string;
  @Input() accountNumber: string;
  @Input() balance: string;
  @Input() arrears: string;
  @Input() status: string;

  additionalDetails: Partial<LoanStatement> = {} as any;

  // todo: fuse this with the above
  constructor(
    private router: Router,
    private decimalPipe: DecimalPipe,
    private loanStatementService: LoanStatementService,
  ) {
    this.loanStatementService.currentLoanStatement$
      .pipe(takeUntilDestroyed())
      .subscribe((res: LoanStatementResponseModel) => {
        try {
          this.additionalDetails = res.data;
          // console.log('res: ', res);
          // console.log('addiotnal details: ', this.additionalDetails);
        } catch {
          this.additionalDetails = {} as any;
        }
        // this.additionalDetails = res.data;
        // // console.log('res: ', res);
        // // console.log('addiotnal details: ', this.additionalDetails);
      });
  }

  private logger = inject(NGXLogger);

  payNow() {
    const url = 'feature/loan-payment/loan-pay';
    this.logger.trace('Account Number: ', this.accountNumber);
    this.logger.trace('Loan Ammount: ', this.loanAmount);
    this.logger.trace('Arrear: ', this.arrears);
    this.logger.trace('Balance: ', this.balance);
    this.logger.trace(
      'Installment: ',
      this.additionalDetails?.STATEMENT_RESP?.esZloanOutStHdr?.installment,
    );

    // this.additionalDetails = {};

    try {
      const queryParams = {
        loanNumber: this.accountNumber,
        loanAmount: parseFloat(this.loanAmount.replace(/,/g, '')),
        arrears: parseFloat(this.arrears.replace(/,/g, '')),
        balance: parseFloat(this.balance.replace(/,/g, '')),
        installment: parseFloat(
          this.additionalDetails?.STATEMENT_RESP?.esZloanOutStHdr
            ?.installment!.replace(/,/g, '')!
            .toString()!,
        ),
      };

      // setTimeout(() => {
      this.router.navigate([url], { queryParams });
      // }, 1000);
    } catch (ex: any) {
      this.logger.error('Some Exception Occured While Going For Payment Page', ex);
      Swal.fire({
        icon: 'error',
        title: 'Error Occurred, While Processing Payment Request',
        text: 'An error occurred while processing your request. Please try after sometime',
      });
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.balance) {
      this.balance = simpleChanges.balance.currentValue;
      this.balance = this.decimalPipe.transform(this.balance, '1.2-2')!;
    }

    if (simpleChanges.arrears) {
      this.arrears = simpleChanges.arrears.currentValue;
      this.arrears = this.decimalPipe.transform(this.arrears, '1.2-2')!;
    }

    if (simpleChanges.loanAmount) {
      this.loanAmount = simpleChanges.loanAmount.currentValue;
      this.loanAmount = this.decimalPipe.transform(this.loanAmount, '1.2-2')!;
    }
  }

  ngOnInit() {
    //this.loanAmount = this.decimalPipe.transform(this.loanAmount, '1.2-2');
  }

  getClasses() {
    return {};
  }

  // Helper
  formatNumber(input: string) {
    const numericValue = parseFloat(input.replace(/,/g, '')); // Remove existing commas
    return this.decimalPipe.transform(numericValue, '1.2')?.toString() || '';
  }
}
