import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalComponent } from '../../../../_metronic/partials';
import { PopupComponent } from '../../../../_metronic/partials/layout/modals/popup/popup.component';
import { LoanApplicationMetadataUpdatedComponent } from '../loan-application-metadata-updated/loan-application-metadata-updated.component';
import { WizardContentComponent } from './wizard-content/wizard-content.component';
import { WizardStep, WizardStepsComponent } from './wizard-steps/wizard-steps.component';
@Component({
  selector: 'app-horizontal-wizard',
  standalone: true,
  imports: [
    CommonModule,
    WizardStepsComponent,
    WizardContentComponent,
    ModalComponent,
    LoanApplicationMetadataUpdatedComponent,
    PopupComponent,
    ModalComponent,
    InlineSVGModule,
    NgbTooltipModule,
  ],
  templateUrl: './horizontal-wizard.component.html',
  styleUrls: ['./horizontal-wizard.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalWizardComponent {
  @Output() public currentClickedItem: EventEmitter<any> = new EventEmitter();

  @Input() public clickableStepCount: number = 0;

  @Input()
  public steps: WizardStep[] = [];

  @Input() stepCount: number = 0;

  @Input()
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);

  nextStep() {
    const nextStep = this.currentStep$.value + 1;

    if (nextStep > this.stepCount) {
      return;
    }
    this.currentStep$.next(nextStep);

    // console.log('steps', this.steps);
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;

    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
  }

  constructor() {}

  // ================= Metadata popup ==================
  @ViewChild('metaDataModel') metaDataModel: PopupComponent;
  @Input({ alias: 'loanApplicationComment' }) loanApplicationComment: string;
  @Input({ alias: 'loanApplicationId' }) currentApplicationId: string;

  @Input({ alias: 'loanApplicationSector' }) loanApplicationSector: any;
  @Input({ alias: 'loanApplicationProductType' }) loanApplicationProductType: any;

  @Input({ alias: 'loanApplicationType' }) loanType: any;
  @Input({ alias: 'loanApplicationStatus' }) loanApplicationStatus: any;
  @Input({ alias: 'loanApplicationSapAppStatus' }) loanApplicationSapAppStatus: any;

  @Input({ alias: 'toggleApplicationMetadata' }) toggleApplicationMetadata: any;
  viewAdditionalDetails() {
    this.metaDataModel.open({
      config: {
        animation: true,
        centered: true,
        backdrop: true,
      },
      data: {
        title: 'Application Additional Details',
        showFooter: false,
      },
    });
  }

  public viewLoanApplicationComment() {
    Swal.fire({
      title: 'Updates On Application',
      text: this.loanApplicationComment,
      heightAuto: false,
    });
  }

  @Output() stepChangesTo: EventEmitter<any> = new EventEmitter();
  onStepChanges(index: number) {
    this.stepChangesTo.emit(index);
  }
}
