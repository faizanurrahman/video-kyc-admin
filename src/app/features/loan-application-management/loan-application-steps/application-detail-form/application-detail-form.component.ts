import {
  AsyncPipe,
  CurrencyPipe,
  DecimalPipe,
  NgClass,
  NgFor,
  NgIf,
  NgStyle,
} from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpLoaderService } from '@core/services/http-loader.service';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { UserDataService } from '@core/services/user-data.service';
import { LoanApplicationStateService } from '@lam/services/loan-application-state.service';
import { LoanApplicationService } from '@lam/services/loan-application.service';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MetronicPopoverComponent } from '@shared/ui/components/metronic-components/metronic-popover/metronic-popover.component';
import { ClickableDirective } from '@shared/ui/directives/dom-event-directives/clickable-button.directive';
import { DigitOnlyDirective } from '@shared/ui/directives/dom-event-directives/only-digit-input.directive';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom, Observable, of, switchMap } from 'rxjs';
import { SweetAlertService } from '../../../../core/services/sweet-alert.service';
import { LoanApplicationRequiredFieldService } from '../../state-management/loan-application-required-field-management.service';
import { IndividualCountService } from '../individual-form/individual-count.service';
import { BranchDetailsService } from './branch-details.service';
import {
  LoanApplicationServiceDetailsModel,
  LoanApplicationServiceDetailsResponseModel,
} from './loan-application-service.model';
import { RequiredApplicationDetailsFields } from './required-fields-for-application-details';

// interface NearestBranch {
//   id: number;
//   name: string;
//   email: string;
// }
@Component({
  selector: 'app-application-detail-form',
  templateUrl: './application-detail-form.component.html',
  styleUrls: ['./application-detail-form.component.scss'],
  providers: [BranchDetailsService, DecimalPipe, CurrencyPipe],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    AsyncPipe,
    DecimalPipe,
    CurrencyPipe,
    DigitOnlyDirective,
    ClickableDirective,
    NgbTooltipModule,
    NgbPopoverModule,
    MetronicPopoverComponent,
    NgStyle,
    NgClass,
  ],
})
export class ApplicationDetailFormComponent implements OnInit, OnChanges, OnDestroy {
  @Output()
  public applicationServiceFormValidityAndProgress: EventEmitter<{
    validity: boolean;
    progress: number;
  }> = new EventEmitter<{ validity: boolean; progress: number }>();

  @Output()
  public nextStepMove: any = new EventEmitter<any>();
  @Output()
  public previousStepMove: any = new EventEmitter<any>();

  @Input()
  public applicationServiceDetails: LoanApplicationServiceDetailsModel;

  private loanApplicationType: string;
  private applicationId: string;
  private sessionId: string;
  private username: string;

  public loading$: Observable<boolean>;
  public loanApplicationDetailsForm: FormGroup;
  // public loanApplicationDetails: LoanApplicationDetailsModel;

  public isApplicationDisabled: boolean = false;

  public nearestBranches: { key: string; value: string }[] = [];
  public nearestBranchKeys: { [key: string]: string };

  // -================Max allowed amount is 50 million pula================
  public maxAllowedAmount: number = 50000000;
  public nowMaxAllowedAmount: number = 50000000;
  public allLoans: any[] = [];

  // =============== Dependencies ================

  // ============== Life Cycle Hooks =================
  constructor(
    private fb: FormBuilder,
    private loanApplicationService: LoanApplicationService,
    private loanApplicationStateService: LoanApplicationStateService,
    private storage: SecureStorageService,
    private activeRoute: ActivatedRoute,
    private loadingService: HttpLoaderService,
    private tostr: ToastrService,
    private branchDetailsService: BranchDetailsService,
    private destroyRef: DestroyRef,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe,
    private userDetailService: UserDataService,
    private activatedRoute: ActivatedRoute,
    private individualCountService: IndividualCountService,
    private storageService: SecureStorageService,
    private swalService: SweetAlertService,
    private loanApplicationRequiredField: LoanApplicationRequiredFieldService,
  ) {
    this.loading$ = this.loadingService.loading$;

    this.applicationServiceFormInit();
  }

  private loanType: any;
  private currentApplicationId: any;
  private loanApplicationSector: any;
  private loanApplicationProductType: any;
  private loanApplicationStatus: any;
  private currentStep: any;
  private individualCount: any = 1;

  ngOnInit(): void {
    // this.applicationServiceFormInit();
    //  this.loanApplicationDetailsForm.patchValue(this.applicationServiceDetails);
    this.loanApplicationStateService.currentLoanStatus$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        if (
          res === 'SUBMITTED' ||
          res === 'APPROVED' ||
          res === 'ACCEPTED' ||
          res === 'REJECTED' ||
          res === 'RESUBMITTED'
        ) {
          this.isApplicationDisabled = true;
          this.loanApplicationDetailsForm.disable();
        } else {
          this.isApplicationDisabled = false;
          this.loanApplicationDetailsForm.enable();
        }
      });

    this.activatedRoute.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((routeRes: any) => {
          this.loanType = routeRes['loanType'];
          this.currentApplicationId = routeRes['applicationId'];
          this.loanApplicationSector = routeRes['sectorType'];
          this.loanApplicationProductType = routeRes['productType'];
          this.loanApplicationStatus = routeRes['loanApplicationStatus'];
          this.currentStep = routeRes['currentStep'];

          //
          return of(true);
        }),

        switchMap((res: any) => {
          return this.loanApplicationService
            .getLoanApplicationDetails(this.applicationId)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        switchMap((res: any) => {
          // checking if any applicant has disability
          const individualDetails: any = res.data.appDetails.loanIndividualDetails;
          this.individualCount = individualDetails.length;
          // console.log('RES----------------', res);
          const loanDocs = res.data.appDetails.loanDocs;

          const numberOfIndividual = res.data.appDetails.loanIndividualDetails.length;
          return of(true);
        }),
      )
      .subscribe((response: any) => {});

    // Initialize nearest branches
    this.initNearestBranches();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.applicationServiceDetails) {
      this.applicationServiceDetails = changes.applicationServiceDetails.currentValue;
      this.patchApplicationServiceDetails();
      // // console.log('ApplicationDetailFormComponent ngOnChanges called');
    }
  }

  ngOnDestroy() {
    // // console.log('ApplicationDetailFormComponent ngOnDestroy called');
  }

  private patchApplicationServiceDetails() {
    this.loanApplicationDetailsForm.patchValue(this.applicationServiceDetails);
  }

  private applicationServiceFormInit() {
    this.createForm();

    const userData = JSON.parse(this.storage.get('user-data'));
    this.sessionId = userData.sessionId;
    this.username = userData.username;
    this.applicationId = this.activeRoute.snapshot.queryParamMap.get('applicationId')!;
    this.loanApplicationType = this.activeRoute.snapshot.queryParamMap.get('loanType')!;

    this.loanApplicationDetailsForm.patchValue({
      applicationId: this.applicationId,
      sessionId: this.sessionId,
    });

    this.loanApplicationDetailsForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const progress = this.calculateProgress();
        const validity = this.loanApplicationDetailsForm.valid;
        this.applicationServiceFormValidityAndProgress.emit({
          validity: validity,
          progress: progress,
        });
      });
  }

  private initNearestBranches() {
    this.branchDetailsService.getBranchList().subscribe({
      next: (res: any) => {
        this.nearestBranchKeys = res;
        const keys = Object.keys(this.nearestBranchKeys);
        keys.forEach((key: string) => {
          const branch = {
            key: key,
            value: this.nearestBranchKeys[key],
          };
          this.nearestBranches.push(branch);
        });
      },
    });
  }

  private createForm() {
    this.loanApplicationDetailsForm = this.fb.group(
      {
        id: [''],
        applicationId: [''],
        sessionId: [''],
        branchId: ['', { validators: [Validators.required], updateOn: 'change' }],
        applicationAmount: [
          '',
          {
            validators: [Validators.required, Validators.pattern(/[0-9]+/)],
            updateOn: 'blur',
          },
        ],
        product: ['', { validators: [Validators.required], updateOn: 'change' }],
        fillStatus: [false],
      },
      {
        updateOn: 'blur',
      },
    );

    const productType = this.activeRoute.snapshot.queryParams.productType;
    const loantype = this.activeRoute.snapshot.queryParams.loanType;
    this.individualCount = this.activatedRoute.snapshot.queryParams.numberOfIndividuals;

    // console.log('active routes params: ', this.activeRoute);

    if (loantype.toLowerCase() === 'mabogodinku' || loantype.toLowerCase() === 'mabogo dinku') {
      this.maxAllowedAmount = 150000 * this.individualCount;
      this.nowMaxAllowedAmount = 150000 * this.individualCount;
    } else {
      this.maxAllowedAmount = 50000000 * this.individualCount;
      this.nowMaxAllowedAmount = 50000000 * this.individualCount;

      if (productType.toLowerCase() === 'letlhabile') {
        this.maxAllowedAmount = 10000 * this.individualCount;
        this.nowMaxAllowedAmount = 10000 * this.individualCount;
      } else if (productType.toLowerCase() === 'mabogodinku') {
        this.maxAllowedAmount = 150000 * this.individualCount;
        this.nowMaxAllowedAmount = 150000 * this.individualCount;
      } else {
        this.maxAllowedAmount = 50000000 * this.individualCount;
        this.nowMaxAllowedAmount = 50000000 * this.individualCount;
      }
    }

    this.loanApplicationDetailsForm
      .get('applicationAmount')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        if (parseFloat(value.replace(/,/g, '')) > this.maxAllowedAmount) {
          // this.tostr.error('Amount exceeds the maximum allowed amount');
          this.applicationAmount.setValue(parseFloat(value.replace(/,/g, '')), {
            emitEvent: false,
          });

          return;
        }

        const formattedValue = this.formatNumber(value);

        this.applicationAmount.setValue(formattedValue, { emitEvent: false });
      });

    // Max Allowed Calculation
    try {
      this.userDetailService
        .getUserData()
        .genericServiceBean.newLoginBean.doMobeeCustomer.allAccList.forEach((item: any) => {
          this.allLoans.push(item);
          // console.log('All Loan Item: ', item);
          // console.log('now max allowed amount is: ', this.nowMaxAllowedAmount);
          this.loanApplicationDetailsForm
            .get('applicationAmount')
            ?.setValidators([
              Validators.required,
              Validators.pattern(/[0-9]+/),
              Validators.max(this.nowMaxAllowedAmount),
            ]);
        });
    } catch {
      // console.log('Error getting user data so setting it to default');
      this.loanApplicationDetailsForm
        .get('applicationAmount')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/[0-9]+/),
          Validators.max(this.maxAllowedAmount),
        ]);
    }
  }

  calculateProgress(): number {
    const totalRequiredSteps = Object.keys(this.loanApplicationDetailsForm.controls).filter(
      (controlName) => {
        const control = this.loanApplicationDetailsForm.controls[controlName];
        return (
          control.validator &&
          control.validator({} as AbstractControl) &&
          control.validator({} as AbstractControl)!.required
        );
      },
    ).length;

    const completedRequiredSteps = Object.keys(this.loanApplicationDetailsForm.controls).filter(
      (controlName) => {
        const control = this.loanApplicationDetailsForm.controls[controlName];
        return (
          control.valid &&
          control.validator &&
          control.validator({} as AbstractControl) &&
          control.validator({} as AbstractControl)!.required
        );
      },
    ).length;

    return (completedRequiredSteps / totalRequiredSteps) * 100;
  }

  public async nextStep() {
    if (this.isApplicationDisabled) {
      this.nextStepMove.emit(true);
      this.applicationServiceFormValidityAndProgress.emit({ validity: true, progress: 100 });
      return;
    }

    const isSaved = await this.saveApplication();
    if (isSaved) {
      this.nextStepMove.emit(true);
    } else {
      return;
    }
  }

  public previousStep() {
    this.previousStepMove.emit(true);
  }

  public async saveApplication() {
    const saveApplicationPayload = this.loanApplicationDetailsForm.getRawValue();
    console.log('application details: ', this.loanApplicationDetailsForm.value);
    saveApplicationPayload.fillStatus = this.loanApplicationDetailsForm.valid;
    console.log('', saveApplicationPayload);
    saveApplicationPayload.applicationAmount = parseFloat(
      saveApplicationPayload.applicationAmount.replace(/,/g, ''),
    );

    return await lastValueFrom(
      this.loanApplicationService.saveApplicationDetails(saveApplicationPayload),
    )
      // LoanApplicationServiceDetailsResponseModel changes to any
      .then((res: LoanApplicationServiceDetailsResponseModel) => {
        // console.log('response application details: ', res);
        if (res.status === 'SUCCESS') {
          // this.tostr.success('Application saved successfully');
          const responseData = res.data.serviceCentres;
          this.loanApplicationDetailsForm.patchValue(responseData);
          // this.loanApplicationDetails = responseData;

          // Show any remaining required fields
          const requiredFieldsForApplicationDetails = this.getRequiredFieldsForApplicationDetails();
          if (requiredFieldsForApplicationDetails.length > 0) {
            // this.showRequiredFields(requiredFieldsForApplicationDetails);
            this.loanApplicationRequiredField.setRequiredFileds(
              'application_details',
              requiredFieldsForApplicationDetails,
            );
          } else {
            this.tostr.success('Company details saved successfully');
            this.loanApplicationRequiredField.removeRequiredFields('application_details');
          }

          return true;
        } else {
          // this.tostr.error('Error while saving application');
          this.swalService.error(
            'Error While Saving Application Details',
            'You must select nearest branch to proceed',
          );

          return false;
        }
      })
      .catch((err) => {
        this.tostr.error('Something bad happened; please try again later.');
        return false;
      });
  }

  public onSubmit() {
    // this.loanApplicationDetails = this.loanApplicationDetailsForm.value; // <-- this is the problem
    // // console.log(this.loanApplicationDetailsForm.value);
  }

  // Getters

  get fc() {
    return this.loanApplicationDetailsForm.controls;
  }

  get applicationAmount() {
    return this.loanApplicationDetailsForm.get('applicationAmount') as FormControl;
  }

  get product() {
    return this.loanApplicationDetailsForm.get('product') as FormControl;
  }

  formatNumber(input: string) {
    // const numericValue = parseFloat(input.replace(/,/g, '')); // Remove existing commas
    const numericValue = parseFloat(input.replace(/[^0-9.-]+/g, ''));
    return this.decimalPipe.transform(numericValue, '1.2')?.toString() || '';
  }

  calculateAllLoanSum() {
    return this.allLoans.reduce((sum: any, item: any) => sum + item.balance, 0);
  }

  abs(value: number) {
    return Math.abs(value);
  }

  private getRequiredFieldsForApplicationDetails(): string[] {
    const requiredFields: string[] = [];

    const legalPersonaGroup = this.loanApplicationDetailsForm;
    const formControls = legalPersonaGroup.controls;

    const fields = Object.keys(formControls);
    for (let j = 0; j < fields.length; j++) {
      const field = formControls[fields[j]];
      if (field.errors) {
        requiredFields.push(RequiredApplicationDetailsFields[fields[j]]);
      }
    }

    return requiredFields;
  }

  public showRequiredFields(requiredFieldsForIndividuals: any[]) {
    const size = requiredFieldsForIndividuals.length;
    if (size === 0) {
      this.tostr.success('Application Saved Successfully', 'Success', {});
      return;
    }

    const itemsHtml = requiredFieldsForIndividuals.map(
      (item: string) => `<li class="list-item text-start">${item} </li>`,
    );

    this.swalService.success('Application Saved Successfully', '', {
      html: `

        <div class="d-flex flex-column g-4">
          <div class="fs-4">
            Please make sure to enter all required field below to move to next step
          </div>
          <div class="fs-3 mt-3 mb-1 py-3 bg-light-primary">Requried Fields</div>
          <ul class="list">
            ${itemsHtml.join('')}
          </ul>
        </div>

      `,
      customClass: {
        container: 'custom-container',
        popup: 'custom-popup',
        title: 'custom-title',
        confirmButton: 'custom-confirm-button',
        icon: 'custom-icon',
      },
      confirmButtonText: 'OK',
    });
    return;
  }
}
