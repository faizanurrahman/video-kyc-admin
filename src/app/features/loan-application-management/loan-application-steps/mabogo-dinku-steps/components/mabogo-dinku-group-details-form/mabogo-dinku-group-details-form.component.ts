import { AsyncPipe, NgClass, NgIf, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation,
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
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpLoaderService } from '../../../../../../core/services/http-loader.service';
import { SecureStorageService } from '../../../../../../core/services/secure-storage.service';
import { SweetAlertService } from '../../../../../../core/services/sweet-alert.service';
import { CountryDropdownComponent } from '../../../../../../shared/ui/components/country-dropdown/country-dropdown.component';
import { TelCountryCodeComponent } from '../../../../../../shared/ui/components/tel-country-code/tel-country-code.component';
import { ClickableDirective } from '../../../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { DigitOnlyDirective } from '../../../../../../shared/ui/directives/dom-event-directives/only-digit-input.directive';
import { AppFirstLetterCapitalizeDirective } from '../../../../../../shared/ui/directives/validator-directives/first-letter-capitalize.directive';
import { CustomValidators } from '../../../../../../shared/utils/custom-validators';
import { LoanApplicationStateService } from '../../../../services/loan-application-state.service';
import { LoanApplicationService } from '../../../../services/loan-application.service';
import { LoanApplicationEffectService } from '../../../../state-management/loan-application-effect.service';
import { LoanApplicationRequiredFieldService } from '../../../../state-management/loan-application-required-field-management.service';
import { LoanApplicationStateManagementService } from '../../../../state-management/loan-application-state-management.service';
import { CapitalizeFirstTwoDirective } from '../../../company-or-group-details/company-uin-mask.directive';
import {
  LoanApplicationCompanyOrGroupModel,
  LoanApplicationCompanyOrGroupResponseModel,
} from '../../../company-or-group-details/loan-application-company-or-group.interface';
import { RequiredCompanyFields } from '../../../company-or-group-details/required-field-for-company-details';
import { CountryMobileNumberRegex } from '../../../individual-form/country-code-regex';
import { EmailIdVerificationInputComponent } from '../../../individual-form/email-id-verification-input/email-id-verification-input.component';
import { MobileNumberVerificationInputComponent } from '../../../individual-form/mobile-number-verification-input/mobile-number-verification-input.component';

@Component({
  selector: 'app-mabogo-dinku-group-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    CountryDropdownComponent,
    TelCountryCodeComponent,
    AsyncPipe,
    ClickableDirective,
    DigitOnlyDirective,
    AppFirstLetterCapitalizeDirective,
    InputMaskModule,
    InputNumberModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CapitalizeFirstTwoDirective,
    MobileNumberVerificationInputComponent,
    EmailIdVerificationInputComponent,
    NgClass,
    NgStyle,
  ],
  providers: [NgxMaskService],
  templateUrl: './mabogo-dinku-group-details-form.component.html',
  styleUrls: ['./mabogo-dinku-group-details-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MabogoDinkuGroupDetailsFormComponent {
  @Input() public legalPersonaDetails: LoanApplicationCompanyOrGroupModel;

  @Output()
  public legalPersonaFormValidityAndProgress: EventEmitter<{
    validity: boolean;
    progress: number;
  }> = new EventEmitter<{ validity: boolean; progress: number }>();
  @Output()
  public nextStepMove: any = new EventEmitter<any>();
  @Output()
  public previousStepMove: any = new EventEmitter<any>();

  private applicationId: string;
  private sessionId: string;

  public loading$: Observable<boolean>;
  public legalPersonaDetailsForm: FormGroup;

  public isApplicationDisabled: boolean = false;

  // - list of all countries

  loanType: string;

  constructor(
    private fb: FormBuilder,
    private loanApplicationService: LoanApplicationService,
    private loanApplicationStatusService: LoanApplicationStateService,
    private storage: SecureStorageService,
    private activeRoute: ActivatedRoute,
    private loadingService: HttpLoaderService,

    private activatedRoute: ActivatedRoute,
    private tostr: ToastrService,
    private destroyRef: DestroyRef,
    private swalService: SweetAlertService,
    private loanApplicationStateManagementService: LoanApplicationStateManagementService,
    private loanApplicationEffectService: LoanApplicationEffectService,
    private loanApplicationRequiredField: LoanApplicationRequiredFieldService,
  ) {
    // // console.log('Legal Persona Form V2 Component Initialized');

    this.loading$ = this.loadingService.loading$;

    // legal persona form intialization
    this.legalPersonaFormInit();

    this.activatedRoute.queryParamMap.pipe().subscribe((res: any) => {
      // console.log('activated route response: ', res);
      this.loanType = res.params.loanType;

      if (this.loanType.toLowerCase() !== 'company') {
        this.legalPersonaDetailsForm
          .get('registrationNumber')
          ?.removeValidators(Validators.required);
        this.legalPersonaDetailsForm
          .get('registrationNumber')
          ?.removeValidators(Validators.pattern(/^BW\d{11}$/i));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.legalPersonaDetails) {
      this.legalPersonaDetails = changes.legalPersonaDetails.currentValue;
      this.patchLegalPersonaDetails();

      // // console.log('Legal Persona Details Changed');
    }
  }

  ngOnInit(): void {
    // this.patchLegalPersonaDetails();

    this.loanApplicationStatusService.currentLoanStatus$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        if (
          res === 'SUBMITTED' ||
          res === 'APPROVED' ||
          res === 'ACCEPTED' ||
          res === 'REJECTED' ||
          res === 'RESUBMITTED'
        ) {
          this.legalPersonaDetailsForm.disable();
          this.isApplicationDisabled = true;
        } else {
          this.legalPersonaDetailsForm.enable();
          this.isApplicationDisabled = false;
        }
      });
  }

  ngOnDestroy(): void {
    // // console.log('Company Details Destroyed');
  }

  // Private methods
  private legalPersonaFormInit() {
    this.legalPersonaDetailsForm = this.fb.group(
      {
        id: [''],
        applicationId: [''],
        sessionId: [''],
        nameOfOrganization: [
          '',
          [Validators.required, CustomValidators.firstLetterCapitalizedValidator()],
        ],
        // dateOfIncorporation: ['', [Validators.required]],
        registrationNumber: ['', []],
        // Note: registration number is changed to UIN number
        preferredCorrespondanceAddr: ['', [Validators.required]],
        postalAddrPoBox: ['', [Validators.required]],
        postalAddrTown: ['', [Validators.required]],
        bussAddrPlot: ['', [Validators.required]],
        bussAddrLocation: ['', []],
        bussAddrDistrict: ['', [Validators.required]],
        bussAddrCountry: ['', [Validators.required]],
        bussAddrTradingAs: ['', []],
        numberOfContacts: ['', []],
        // primaryContactPreferredCommType: ['', [Validators.required]],
        primaryContactMobNumberCode: ['267', [Validators.required]],
        primaryContactMobNumber: ['', [Validators.required, Validators.pattern(/^7\d{3}\d{4}$/)]],

        primaryContactOtherContactNumber: ['', []],
        primaryContactOtherContactNumberCode: ['267', []],
        primaryContactEmailAddress: [
          '',
          [Validators.required, CustomValidators.emailAddressValidator()],
        ],
        fillStatus: [false],
      },
      { updateOn: 'change' },
    );
    const userData = JSON.parse(this.storage.get('user-data'));
    this.sessionId = userData.sessionId;
    this.applicationId = this.activeRoute.snapshot.queryParamMap.get('applicationId')!;

    this.legalPersonaDetailsForm.patchValue({
      sessionId: this.sessionId,
      applicationId: this.applicationId,
    });

    this.legalPersonaDetailsForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {});

    // emit form validity
    this.legalPersonaDetailsForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status: any) => {
        this.legalPersonaFormValidityAndProgress.emit({
          validity: this.legalPersonaDetailsForm.valid,
          progress: this.calculateProgress(),
        });
      });
  }

  private patchLegalPersonaDetails() {
    if (this.legalPersonaDetails) {
      this.legalPersonaDetailsForm.patchValue(this.legalPersonaDetails);

      const primaryMobileNumber = this.legalPersonaDetails.primaryContactMobNumber;

      const primaryMobileNumberArray = primaryMobileNumber?.split('-') || ['267', ''];
      this.legalPersonaDetailsForm
        .get('primaryContactMobNumber')
        ?.setValue(primaryMobileNumberArray[1]);
      this.legalPersonaDetailsForm
        .get('primaryContactMobNumberCode')
        ?.setValue(primaryMobileNumberArray[0]);

      const primaryContactOtherContactNumber =
        this.legalPersonaDetails.primaryContactOtherContactNumber?.split('-') || ['267', ''];
      this.legalPersonaDetailsForm
        .get('primaryContactOtherContactNumberCode')
        ?.setValue(primaryContactOtherContactNumber[0]);
      this.legalPersonaDetailsForm
        .get('primaryContactOtherContactNumber')
        ?.setValue(primaryContactOtherContactNumber[1]);
    }
  }

  public async nextStep() {
    // if application is desabled then do not save the application
    if (this.isApplicationDisabled) {
      this.nextStepMove.emit(true);
      this.legalPersonaFormValidityAndProgress.emit({
        validity: true,
        progress: 100,
      });
      return;
    }

    const isSaved = await this.saveApplication();
    if (isSaved) {
      this.nextStepMove.emit(true);
    }
    return;
  }

  public async previousStep() {
    this.previousStepMove.emit(true);
    return;
  }

  public async saveApplication() {
    let legalPersonaPayload = this.legalPersonaDetailsForm.getRawValue();
    let fillStatus = this.legalPersonaDetailsForm.valid;
    legalPersonaPayload.fillStatus = fillStatus;

    // On save application modifying mobile number, appending county code to it
    legalPersonaPayload.primaryContactMobNumber =
      legalPersonaPayload?.primaryContactMobNumberCode +
      '-' +
      legalPersonaPayload?.primaryContactMobNumber;

    legalPersonaPayload.primaryContactOtherContactNumber =
      legalPersonaPayload?.primaryContactOtherContactNumberCode +
      '-' +
      legalPersonaPayload?.primaryContactOtherContactNumber;

    return await lastValueFrom(
      this.loanApplicationService.saveLegalPersonaMabogoDinku(legalPersonaPayload),
    )
      // LegalPersonaResponseModel is changed to any
      .then((res: LoanApplicationCompanyOrGroupResponseModel) => {
        if (res.status === 'SUCCESS') {
          const responseData = res.data;

          this.legalPersonaDetails = responseData.legalPersona;
          this.patchLegalPersonaDetails();
          // this.legalPersonaDetailsForm.patchValue(responseData);

          // Show any remaining required fields
          const requiredFieldForCompany = this.getRequiredFieldsForCompany();
          if (requiredFieldForCompany.length > 0) {
            this.showRequiredFields(requiredFieldForCompany);
          } else {
            this.tostr.success('Company details saved successfully');
          }

          if (this.legalPersonaDetails.fillStatus) {
            this.loanApplicationRequiredField.removeRequiredFields('company_details');
          }

          return true;
        } else {
          this.tostr.error('Error Saving Company details');
          return false;
        }
      })
      .catch((err: any) => {
        this.tostr.error('Error Saving Company details');
        return false;
      });
  }

  // Public Methods

  // Getter Methods
  get fc() {
    return this.legalPersonaDetailsForm.controls as {
      [key: string]: FormControl;
    };
  }

  // run time validation
  isNumberKey(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  calculateProgress(): number {
    const totalRequiredSteps = Object.keys(this.legalPersonaDetailsForm.controls).filter(
      (controlName: any) => {
        const control = this.legalPersonaDetailsForm.controls[controlName];
        return (
          control.validator &&
          control.validator({} as AbstractControl) &&
          control.validator({} as AbstractControl)!.required
        );
      },
    ).length;

    const completedRequiredSteps = Object.keys(this.legalPersonaDetailsForm.controls).filter(
      (controlName: any) => {
        const control = this.legalPersonaDetailsForm.controls[controlName];
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

  // Error from OpenAI!
  public isEmailValid(emailId: string): any {
    if (emailId === null || emailId === undefined || emailId === '') {
      return false;
    }

    const email = emailId.trim();
    // either empty or valid email
    if (email.length === 0) {
      return true;
    }
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return pattern.test(email);
  }
  public isMobileNumberValid(mobileNumber: string, countryCode: string = '267'): any {
    if (mobileNumber === null || mobileNumber === undefined || mobileNumber === '') {
      return false;
    }

    const mobile = countryCode + '-' + mobileNumber.trim();

    let pattern = CountryMobileNumberRegex[countryCode];
    if (pattern === undefined) {
      pattern = new RegExp(`^${countryCode}-\\d{1,}X*$`);
    }
    return pattern.test(mobile);
  }

  public isTelephoneNumberValid(telephoneNumber: string, countryCode: string = '267') {
    if (telephoneNumber === null || telephoneNumber === undefined || telephoneNumber === '') {
      return false;
    }

    const telephone = countryCode + '-' + telephoneNumber.trim();

    // let pattern = CountryMobileNumberRegex[countryCode];

    let pattern = /^267-\d{7,8}$/;
    if (this.loanType.toLowerCase() !== 'individual') {
      pattern = /^267-\d{8}$/;
    }
    if (pattern === undefined) {
      pattern = new RegExp(`^${countryCode}-\\d{1,}X*$`);
    }

    return pattern.test(telephone);
  }

  // --- Required Field ---
  private getRequiredFieldsForCompany(): string[] {
    const requiredFields: string[] = [];

    const legalPersonaGroup = this.legalPersonaDetailsForm;
    const formControls = legalPersonaGroup.controls;

    const fields = Object.keys(formControls);
    for (let j = 0; j < fields.length; j++) {
      const field = formControls[fields[j]];
      if (field.errors) {
        requiredFields.push(RequiredCompanyFields[fields[j]]);
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
