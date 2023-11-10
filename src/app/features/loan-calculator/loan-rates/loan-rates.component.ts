import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoanRateService } from '@features/loan-calculator/loan-rates/loan-rates.service';

export interface LoanRate {
  scale: string;
  amount: string;
  specialSectorRates: string;
  otherSectorRates: string;
  repaymentPeriod: string;
}

export interface LoanRateResponse {
  loanRatesList: LoanRate[];
  loanRatesNotes: string;
}

@Component({
  selector: 'app-loan-rates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-rates.component.html',
  styleUrls: ['./loan-rates.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LoanRatesComponent implements OnInit {
  loanRatesList: LoanRate[];
  loanRatesNotes: string;

  constructor(private loanRateService: LoanRateService) {}

  ngOnInit(): void {
    this.fetchLoanRates();
  }

  fetchLoanRates(): void {
    this.loanRateService.getLoanRates().subscribe((response: LoanRateResponse) => {
      this.loanRatesList = response.loanRatesList;
      this.loanRatesNotes = response.loanRatesNotes;

      // console.log('Response came for loan rates: ', response);
    });
  }
}
