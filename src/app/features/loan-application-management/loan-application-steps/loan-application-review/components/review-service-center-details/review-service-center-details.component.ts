import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { LoanApplicationServiceDetailsModel } from '../../../application-detail-form/loan-application-service.model';
import { ReadOnlyInputComponent } from '../read-only-input/read-only-input.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'review-service-center-details',
  standalone: true,
  imports: [CommonModule, ReadOnlyInputComponent],
  templateUrl: './review-service-center-details.component.html',
  styleUrls: ['./review-service-center-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewServiceCenterDetailsComponent {
  @Input() loanServiceCentre: LoanApplicationServiceDetailsModel;
}
