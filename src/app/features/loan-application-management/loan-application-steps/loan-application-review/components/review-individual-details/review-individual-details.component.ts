import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { IndividualDetailsModel } from '../../../individual-form/individual-form.model';
import { ReadOnlyInputComponent } from '../read-only-input/read-only-input.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'review-individual-details',
  standalone: true,
  imports: [CommonModule, ReadOnlyInputComponent],
  templateUrl: './review-individual-details.component.html',
  styleUrls: ['./review-individual-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewIndividualDetailsComponent {
  @Input() loanApplicationType: string;
  @Input() loanIndividualDetails: IndividualDetailsModel[];
}
