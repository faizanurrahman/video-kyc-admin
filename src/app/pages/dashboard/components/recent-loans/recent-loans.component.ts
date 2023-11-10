import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../../../core/services/sweet-alert.service';
import { UserDataService } from '../../../../core/services/user-data.service';
import { LoanApplicationService } from '../../../../features/loan-application-management/services/loan-application.service';
import { LoanApplicationEffectService } from '../../../../features/loan-application-management/state-management/loan-application-effect.service';
import { LoanApplicationStateManagementService } from '../../../../features/loan-application-management/state-management/loan-application-state-management.service';
import { AutoAnimateDirective } from '../../../../shared/ui/directives/dom-event-directives/auto-animate.directive';
import { ClickableDirective } from '../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { ClickableSvgDirective } from '../../../../shared/ui/directives/dom-event-directives/clickable-svg-icon.directives';
import { PopupComponent } from '../../../../_metronic/partials/layout/modals/popup/popup.component';
import {
  DeleteLoanApplicationPayloadInterface,
  DeleteLoanApplicationService,
} from './delete-loan-application.service';
import { SortArrayPipe } from './short-latest-loan-application.pipe';

interface ActiveLoan {
  applicationId: string;
  loanApplicationType: string;

  createdOn: string;
  updatedOn: string;
  status:
    | 'APPLICATION_NOT_ACCEPTED'
    | 'REQUEST_FOR_CHANGE'
    | 'REJECTED'
    | 'ACCEPTED'
    | 'SUBMITTED'
    | 'PENDING';
  activityIcon?: any;
  sapAppStatus?: string;

  productType: string;
  sectorType: string;
}

@Component({
  selector: 'app-recent-loans',
  templateUrl: './recent-loans.component.html',
  styleUrls: ['./recent-loans.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    InlineSVGModule,
    NgbTooltip,
    PopupComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    ClickableDirective,
    ClickableSvgDirective,
    AutoAnimateDirective,
    SortArrayPipe,
    TitleCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentLoansComponent implements OnDestroy {
  @HostBinding('class') classes = 'card  card-scroll h-270px';

  @ViewChild('deleteLoanApplicationPopup') popup: PopupComponent;

  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  deleteLoanApplicationForm: FormGroup;

  allLoans: ActiveLoan[];

  feedbackCharLimit: number = 250;
  currentCharCount: number = 0;

  constructor(
    private loanApplicationService: LoanApplicationService,

    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private deleteLoanApplicationService: DeleteLoanApplicationService,
    private userDataService: UserDataService,
    private destroyRef: DestroyRef,
    private swalService: SweetAlertService,
    private loanApplicationStateManagementService: LoanApplicationStateManagementService,
    private loanApplicationEffectService: LoanApplicationEffectService,
  ) {
    this.getAllLoanApplication();

    this.deleteLoanApplicationForm = this.fb.group({
      applicationId: ['', Validators.required],
      mainReason: ['', Validators.required],
      otherReason: ['', Validators.maxLength(this.feedbackCharLimit)],
    });

    this.deleteLoanApplicationForm
      .get('otherReason')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: String) => {
        this.currentCharCount = res.length;
      });
  }

  getAllLoanApplication() {
    console.log('Get Loan Application called on recent loands');
    this.loading$.next(true);
    this.loanApplicationService
      .getAllLoanApplication()
      // this.loanApplicationEffectService.fetchAllLoanApplications(false);
      // this.loanApplicationStateManagementService.allLoanApplication$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        this.allLoans = res?.data?.applications || [];
        this.allLoans.map((item: any) => {
          item.activityIcon = '/assets/media/icons/next-icon.svg';
        });

        // this.allLoans = [...this.allLoans.reverse()];

        this.loading$.next(false);
      });
  }

  viewLoanApplication(item: any) {
    // // console.log('item: ', item);

    if (
      item.loanApplicationType.toString().toLowerCase() === 'mabogodinku' ||
      item.loanApplicationType.toString().toLowerCase() === 'mabogo dinku'
    ) {
      this.router.navigate(['/loan-application-management/mabogo-dinku-init'], {
        queryParams: {
          loanType: item.loanApplicationType,
          applicationId: item.applicationId,
          sectorType: item.sectorType,
          productType: item.productType,
          currentStep: 1,
          loanApplicationSapAppStatus: item.sapAppStatus,
        },
      });
    } else {
      this.router.navigate(['/loan-application-management/init'], {
        queryParams: {
          loanType: item.loanApplicationType,
          applicationId: item.applicationId,
          sectorType: item.sectorType,
          productType: item.productType,
          currentStep: 1,
          loanApplicationSapAppStatus: item.sapAppStatus,
        },
      });
    }
  }

  deleteLoanApplication(item: any) {
    // console.log('Selected Loan Items are : ', item);
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    Swal.fire({
      title: 'Are you sure want to delete',
      heightAuto: false,
      html: `
      `,
    }).then(
      (res: any) => {
        // console.log('Response from swal popup', res);
        window.scrollTo(0, scrollTop);
      },
      (err: any) => {
        console.error('Error from swal popup', err);
        window.scrollTo(0, scrollTop);
      },
    );
  }

  public openDeleteApplicationModel(applicationDetails: ActiveLoan) {
    // // console.log('open modal feedback', feedback);

    this.deleteLoanApplicationForm.patchValue({
      applicationId: applicationDetails.applicationId,
    });

    // If application status is accepted then do not allow to delte it
    if (applicationDetails.status === 'ACCEPTED') {
      this.swalService.error(
        'Cannot Delete Loan Application',
        'This loan application has been accepted and cannot be deleted.',
      );
      return;
    }

    this.popup
      .open({
        config: {
          container: 'body',
          backdrop: 'static',
          scrollable: true,
          fullscreen: false,
          centered: true,
          backdropClass: 'custom-backdrop',
          windowClass: 'custom-window',
          modalDialogClass: '',
        },
        data: {
          title: 'Delete Loan Application',
          showFooter: false,
        },
      })
      .then((result: any) => {});
  }

  public closeModal() {
    this.popup.close().then((r) => {
      // // console.log('popup closed');
      this.deleteLoanApplicationForm.reset();
      this.cdr.detectChanges();
    });
  }

  deleteApplicationFormSubmitted() {
    if (this.deleteLoanApplicationForm.invalid) {
      this.swalService.error(
        'Invalid Deletion Reason',
        'Please choose an appropriate reason for deleting the loan application.',
      );
    } else {
      const payload: DeleteLoanApplicationPayloadInterface = {
        applicationId: this.deleteLoanApplicationForm.get('applicationId')?.value,
        prDelReason: this.deleteLoanApplicationForm.get('mainReason')?.value,
        scDelReason: this.deleteLoanApplicationForm.get('otherReason')?.value,
        sessionId: '',
      };

      const userData = this.userDataService.getUserData();
      payload.sessionId = userData.sessionId;

      this.swalService
        .question(
          'Confirm Loan Application Deletion',
          'Are you sure you want to delete this loan application? This action cannot be undone. Proceed only if you are certain.',
          {
            showCancelButton: true,
            cancelButtonText: 'Cancel',
          },
        )
        .then((result) => {
          if (result.isConfirmed) {
            this.deleteLoanApplicationService
              .deleteLoanApplication(payload)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe((result: any) => {
                if (result.status === 'SUCCESS') {
                  this.getAllLoanApplication();

                  this.swalService.success(
                    `Loan Application ${
                      this.deleteLoanApplicationForm.get('applicationId')?.value
                    } Deleted`,
                    'The loan application has been successfully deleted.',
                  );

                  this.deleteLoanApplicationForm.reset();
                } else if (result.status === 'FAILURE') {
                  this.swalService.error(
                    `Loan Application ${
                      this.deleteLoanApplicationForm.get('applicationId')?.value
                    } Not Deleted`,
                    'An error occurred while attempting to delete the loan application. Please try again later.',
                  );
                }
              });
          } else {
            this.deleteLoanApplicationForm.reset();
          }
        });
    }

    this.closeModal();
  }

  ngOnDestroy() {}
}
