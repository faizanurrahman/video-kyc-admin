import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { LoanApplicationCompanyOrGroupModel } from '../../../company-or-group-details/loan-application-company-or-group.interface';
import { ReadOnlyInputComponent } from '../read-only-input/read-only-input.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'review-company-group-details',
  standalone: true,
  imports: [CommonModule, ReadOnlyInputComponent],
  templateUrl: './review-company-group-details.component.html',
  styleUrls: ['./review-company-group-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCompanyGroupDetailsComponent {
  @Input() companyDetails: LoanApplicationCompanyOrGroupModel;
}
