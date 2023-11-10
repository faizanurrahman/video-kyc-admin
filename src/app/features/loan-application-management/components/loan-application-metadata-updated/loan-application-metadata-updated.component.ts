import { NgClass, NgFor, NgIf, NgStyle, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import Swal from 'sweetalert2';
import { AutoAnimateDirective } from '../../../../shared/ui/directives/dom-event-directives/auto-animate.directive';
import {
  LoanApplicationProductType,
  LoanApplicationSectorType,
  LoanApplicationStatusType,
  LoanApplicationType,
} from '../../models/loan-application.enum';

@Component({
  selector: 'app-loan-application-metadata-updated',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    TitleCasePipe,
    NgStyle,
    NgClass,
    InlineSVGModule,
    NgbTooltipModule,
    AutoAnimateDirective,
  ],
  templateUrl: './loan-application-metadata-updated.component.html',
  styleUrls: ['./loan-application-metadata-updated.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanApplicationMetadataUpdatedComponent {
  @Input() public toggleApplicationMetadata: boolean;
  @Input() public loanApplicationId: string;
  @Input() public loanApplicationSector: LoanApplicationSectorType;
  @Input() public loanApplicationProductType: LoanApplicationProductType;
  @Input() public loanApplicationType: LoanApplicationType;
  @Input() public loanApplicationStatus: LoanApplicationStatusType;
  @Input() public loanApplicationComment: string;
  @Input() public loanApplicationSapAppStatus: string;

  public viewLoanApplicationComment() {
    Swal.fire({
      title: 'Additional Information',
      text: this.loanApplicationComment,
      heightAuto: false,
    });
  }
}
