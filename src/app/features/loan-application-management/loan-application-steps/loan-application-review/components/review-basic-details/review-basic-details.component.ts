import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { LoanBasicDetails } from '../../../../models/loan-basic-details.interface';
import { ReadOnlyInputComponent } from '../read-only-input/read-only-input.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'review-basic-details',
  standalone: true,
  imports: [CommonModule, ReadOnlyInputComponent],
  templateUrl: './review-basic-details.component.html',
  styleUrls: ['./review-basic-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewBasicDetailsComponent {
  @Input() loanBasicDetails: LoanBasicDetails;
}
