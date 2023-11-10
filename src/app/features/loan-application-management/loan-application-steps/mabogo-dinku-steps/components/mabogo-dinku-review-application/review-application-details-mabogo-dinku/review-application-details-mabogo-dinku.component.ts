import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ReadOnlyInputComponent } from '../../../../loan-application-review/components/read-only-input/read-only-input.component';
import { MabogoDinkuApplicationDetailsModel } from '../../../models/mabogo-dinku-application-details-model';

@Component({
  selector: 'review-application-details-mabogo-dinku',
  standalone: true,
  imports: [CommonModule, ReadOnlyInputComponent],
  templateUrl: './review-application-details-mabogo-dinku.component.html',
  styleUrls: ['./review-application-details-mabogo-dinku.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewApplicationDetailsMabogoDinkuComponent {
  @Input() loanServiceCentre: MabogoDinkuApplicationDetailsModel[];

  ngOnInit() {
    console.log('Loan Service Center Recieved is: ', this.loanServiceCentre);
  }
}
