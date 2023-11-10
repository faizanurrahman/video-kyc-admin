import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoanStatementResponseModel } from '../../../../../features/loan-statements/models/loan-statement-response.model';
import { EsZloanOutStHdr } from '../../../../../features/loan-statements/models/loan-statements.model';
import { LoanStatementService } from '../../../../../features/loan-statements/services/loan-statement.service';

@Component({
  selector: 'app-loan-additional-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-additional-details.component.html',
  styleUrls: ['./loan-additional-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,

  providers: [DecimalPipe],
})
export class LoanAdditionalDetailsComponent {
  @Input() accountNumber: string;

  additionalInformation: EsZloanOutStHdr;

  constructor(
    private decimalPipe: DecimalPipe,
    private loanStatementService: LoanStatementService,
  ) {
    this.loanStatementService.currentLoanStatement$
      .pipe(takeUntilDestroyed())
      .subscribe((res: LoanStatementResponseModel) => {
        try {
          this.additionalInformation = res.data.STATEMENT_RESP.esZloanOutStHdr;
          // console.log('additional information got is: ', this.additionalInformation);
        } catch (e: any) {
          this.additionalInformation = {} as EsZloanOutStHdr;
        }
      });
  }

  getDecimalValue(value: string) {
    const numericValue = parseFloat(value.replace(/,/g, '')); // Remove existing commas
    return this.decimalPipe.transform(numericValue, '1.2')?.toString() || '';
  }
}
