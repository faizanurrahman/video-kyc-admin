import { AsyncPipe, JsonPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PopupComponent,
  PopupComponent as PopupComponent_1,
} from '@kt/partials/layout/modals/popup/popup.component';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../../environments/environment';
import { HttpLoaderService } from '../../../../../../core/services/http-loader.service';
import { SecureStorageService } from '../../../../../../core/services/secure-storage.service';
import { SweetAlertService } from '../../../../../../core/services/sweet-alert.service';
import { IbUserModel } from '../../../../../../modules/auth/models/ib-user.model';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NGXLogger } from 'ngx-logger';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { CountryDropdownComponent } from '../../../../../../shared/ui/components/country-dropdown/country-dropdown.component';
import { OtpInputComponent } from '../../../../../../shared/ui/components/otp-input/otp-input.component';
import { SelectComponent } from '../../../../../../shared/ui/components/select/select.component';
import { TelCountryCodeComponent } from '../../../../../../shared/ui/components/tel-country-code/tel-country-code.component';
import { ClickableDirective } from '../../../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { AlphabetOnlyDirective } from '../../../../../../shared/ui/directives/dom-event-directives/only-alphabet-input.directive';
import { DigitOnlyDirective } from '../../../../../../shared/ui/directives/dom-event-directives/only-digit-input.directive';
import { ValidatorDirectivesModule } from '../../../../../../shared/ui/directives/validator-directives/validator-directives.module';
import { CollapsibleContentComponent } from '../../../../components/collapsible-content/collapsible-content.component';
import { LoanApplicationType } from '../../../../models/loan-application.enum';
import { LoanApplicationContactVarificationService } from '../../../../services/loan-application-contact-varification.service';
import { LoanApplicationStateService } from '../../../../services/loan-application-state.service';
import { LoanApplicationService } from '../../../../services/loan-application.service';
import { LoanApplicationRequiredFieldService } from '../../../../state-management/loan-application-required-field-management.service';
import { FileUploaderV2Component } from '../../../document-details-form-updated/file-uploader-v2/file-uploader-v2.component';
import { CountryMobileNumberRegex } from '../../../individual-form/country-code-regex';
import { IndividualCountService } from '../../../individual-form/individual-count.service';
import {
  IndividualDetailsModel,
  IndividualsCreateBody,
  IndividualsCreateResponse,
} from '../../../individual-form/individual-form.model';
import { differentKinAddressesValidator } from '../../../individual-form/kin-address-validator';
import { kinContactsWithinDifferentValidator } from '../../../individual-form/kin-contact-within-individual-unique-validator';
import { MobileNumberVerificationInputComponent } from '../../../individual-form/mobile-number-verification-input/mobile-number-verification-input.component';
import { omangNumberUniqueValidator } from '../../../individual-form/omang-number-unique-validator';
import { primaryMobileNumberUniqueValidator } from '../../../individual-form/primary-contact-across-individual.validator';
import { RequiredIndividualFields } from '../../../individual-form/required-field';
import { IndividualDetailsService } from './individual-details.service';

@Component({
  selector: 'app-mabogo-dinku-individual-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgClass,
    NgStyle,
    CollapsibleContentComponent,
    SelectComponent,
    NgbTooltip,
    TelCountryCodeComponent,
    CountryDropdownComponent,
    PopupComponent_1,
    AsyncPipe,
    OtpInputComponent,
    ClickableDirective,
    FileUploaderV2Component,
    ValidatorDirectivesModule,
    DigitOnlyDirective,
    MobileNumberVerificationInputComponent,
    PanelModule,
    DividerModule,
    InlineSVGModule,
    ConfirmPopupModule,
    AlphabetOnlyDirective,
    JsonPipe,
    TabViewModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './mabogo-dinku-individual-form.component.html',
  styleUrls: ['./mabogo-dinku-individual-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MabogoDinkuIndividualFormComponent {
  activeIndex: number = 0;
  // ====================== Input Properties ======================

  @Input() public individualDetails: IndividualDetailsModel[] = [];
  @Input() public applicationId: string = '';

  @ViewChild('phoneNumberInput', { static: true }) phoneNumberInput: any;

  // ================= Output Properties =================
  @Output()
  public nextStepMove: any = new EventEmitter<any>();
  @Output()
  public previousStepMove: any = new EventEmitter<any>();
  @Output()
  public individualFormValidityAndProgress: EventEmitter<{ validity: boolean; progress: number }> =
    new EventEmitter<{ validity: boolean; progress: number }>();

  // =================== Public Properties ======================
  public otpVerificationType: 'EMAIL' | 'PHONE' | 'NONE' = 'NONE';
  public otpVerificationIndex: number = 0;
  public isApplicationDisabled: boolean = false;
  public saveButtonDisabled: boolean = false;
  public mobileCountryCodeIsFocus: boolean = false;
  public secondaryMobileCountryCodeFocused: boolean = false;
  public otherTelephoneNumberCountryCodeFocused: boolean = false;
  public loading$: Observable<boolean>;
  public loanApplicationType: LoanApplicationType;
  public numberOfIndividuals: number = 1;
  public individualForm: FormGroup;
  public otpForm: FormGroup;

  // -  OTP verification popup
  // References the popup component
  @ViewChild('otpVerificationPopup')
  otpVerificationPopup: PopupComponent;

  // - Mobile Number and Email Address Verification
  // References the mobileNumber and emailAddress input fields
  @ViewChild('mobileNumber') mobileNumber: ElementRef<HTMLInputElement>;
  @ViewChild('email') emailAddress: ElementRef<HTMLInputElement>;

  // - Omang number verification
  @ViewChild('omangExpirtyDate') omangExpirtyDate: BsDatepickerDirective;
  public omangExpiryBsConfig: Partial<BsDatepickerConfig> = {};
  public maxDateOfOmangExpiry = new Date();
  public minDateOfOmangExpiry = new Date().toISOString().split('T')[0];

  public maxBirthDate: string;
  public minBirthDate: string;

  // Additional properties
  private sessionId: string;
  private username: string;

  private manualSubscriptions: Subscription[] = [];
  private omangNumberSubscriptions: Subscription[] = [];

  // ===================== Inject Dependency =============================
  private formBuilder = inject(FormBuilder);
  private loanApplicationService = inject(LoanApplicationService);
  private contactVerificationService = inject(LoanApplicationContactVarificationService);
  private storage = inject(SecureStorageService);
  private activeRoute = inject(ActivatedRoute);
  private loadingService = inject(HttpLoaderService);
  private loanStateService = inject(LoanApplicationStateService);
  private toastrService = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  private destoryRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private individualCountService = inject(IndividualCountService);
  private swalService = inject(SweetAlertService);
  private loanApplicationRequiredField = inject(LoanApplicationRequiredFieldService);
  private http = inject(HttpClient);

  private readonly logger = inject(NGXLogger);
  private individualStateService = inject(IndividualDetailsService);

  constructor() {
    this.loading$ = this.loadingService.loading$;

    this.birthDateRangeSetup();

    this.minDateOfOmangExpiry = this.omangExpiryDateSetup();

    // Create Individual Form
    this.individualFormInit();
  }

  // ====================== Life Cycle Hooks ==========================
  ngOnInit(): void {
    // console.log('value came from parent: ', this.individualDetails);
    this.logger.debug(
      'On Init Individual: Individual Details Came from Parent: ',
      this.individualDetails,
    );

    this.patchIndividualDetails();
    this.onIndividualFormStatusChange();

    // Check the current status of the loan application to determine if it is disabled.
    // If the status is SUBMITTED, APPROVED or REJECTED, disable the individualForm.
    // Otherwise, enable the form.
    this.loanStateService.currentLoanStatus$
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((res: any) => {
        if (
          res === 'SUBMITTED' ||
          res === 'APPROVED' ||
          res === 'ACCEPTED' ||
          res === 'REJECTED' ||
          res === 'RESUBMITTED'
        ) {
          this.individualForm.disable();
          this.isApplicationDisabled = true;
        } else {
          this.individualForm.enable();

          // Fixed:  Disable Gender Form Control for Each Individual

          // Get the number of individuals in the individualList array
          const numberOfIndividuals = this.individualList.length;

          // Iterate over each individual in the individualList array
          for (let i = 0; i < numberOfIndividuals; i++) {
            // Get the control group for the current individual
            const individualControlGroup = this.individualList.at(i);

            // Disable the gender form control for the current individual's control group
            individualControlGroup.get('gender')?.disable();
          }

          this.isApplicationDisabled = false;
        }
      });

    // Initialize the OTP form with four fields for entering the verification code,
    // and set validation rules for each field.
    this.otpForm = this.formBuilder.group(
      {
        codeDigit: new FormControl('', []),
      },
      {
        updateOn: 'change',
      },
    );

    // Get country codes from constants file and assign them to a variable.
    // this.countryCodes = CountryCodes;

    // Set configurations for displaying omang expiry date
    this.omangExpiryBsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
        dateOutputFormat: 'YYYY-MM-DD',
        showWeekNumbers: false,
        todayHighlight: true,
        selectTodayOnClick: true,
        showTodayButton: false,
        customTodayClass: 'today',
        outsideClick: true,
        minDate: new Date(new Date().toISOString().split('T')[0]),
        adaptivePosition: true,
      },
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.individualDetails) {
      this.individualDetails = changes.individualDetails.currentValue;
      if (!!this.individualDetails && this.individualDetails.length > 0) {
        // console.log('parent component changed the value: ', this.individualDetails);
        // console.log('On change calling form patch individuals');
        this.patchIndividualDetails();
        // this.individualList.markAllAsTouched();
      }
    }
  }

  ngOnDestroy() {
    // clear omang subscriptions
    this.omangNumberSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  // ====================== GETTER AND SETTER ==================

  get individualFormControl() {
    return this.individualForm.controls;
  }
  get individualList() {
    return (this.individualForm.get('individualList') || []) as FormArray;
  }

  // ----------- CREATE INDIVIDUAL ------------
  public nextDisableForCreditCheck: boolean = false;
  private createIndividual(): FormGroup {
    let individualForm = this.formBuilder.group(
      {
        id: [''],
        title: ['', [Validators.required]],
        fullName: ['', [Validators.required]],
        dob: ['', []],
        dateOfBirth: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        maritalStatus: ['', [Validators.required]],
        maritalRegime: [''],
        botswanaCitizen: ['', []],
        omangNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
            Validators.pattern(/^\d{4}[12]\d{4}$/),
          ],
        ],
        dateOfOmangExpiry: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        foreignPassportNumber: ['', []],

        foreignPassportExpiry: ['', []],
        nationality: ['', [Validators.required]],
        communicationType: ['', []],
        mobileNumber: ['', [Validators.required]],
        mobileNumberCountryCode: ['267'],
        mobileNumberStatus: new FormControl<'NOT_VERIFIED' | 'VERIFIED'>('NOT_VERIFIED', [
          Validators.required,
          Validators.pattern('VERIFIED'),
        ]),

        secondaryMobileNumber: ['', []],
        secondaryMobileNumberCountryCode: ['267'],
        otherContactNumber: ['', []],
        otherContactNumberCountryCode: ['267'],
        emailAddress: ['', []],
        emailAddressStatus: new FormControl<'NOT_VERIFIED' | 'VERIFIED'>('NOT_VERIFIED', [
          Validators.required,
        ]),
        corresspondanceAddress: ['', []],
        addrPlot: ['', [Validators.required]],
        addrSuburb: ['', [Validators.required]],
        addrTown: ['', [Validators.required]],
        addrCountry: ['', [Validators.required]],
        addrDuration: ['', []],
        postalAddrPoBox: ['', [Validators.required]],
        postalAddrTown: ['', [Validators.required]],

        empNoOfJobs: ['', []],
        empDetails: this.formBuilder.array([], []),

        hvAddrPlot: ['', [Validators.required]],
        hvAddrSuburb: ['', [Validators.required]],
        hvAddrTown: ['', [Validators.required]],
        hvAddrCountry: ['', [Validators.required]],
        nkAddrPlot: ['', [Validators.required]],
        nkAddrSuburb: ['', [Validators.required]],
        nkAddrTown: ['', [Validators.required]],
        nkAddrCountry: ['', [Validators.required]],
        nkContact: ['', [Validators.required]],
        nkContactCountryCode: ['267'],
        nkName: ['', [Validators.required]],
        nkSurname: ['', [Validators.required]],
        nkRelationship: ['', [Validators.required]],

        nkAddrPlot2: ['', [Validators.required]],
        nkAddrSuburb2: ['', [Validators.required]],
        nkAddrTown2: ['', [Validators.required]],
        nkAddrCountry2: ['', [Validators.required]],
        nkContact2: ['', [Validators.required]],
        nkContact2CountryCode: ['267'],
        nkName2: ['', [Validators.required]],
        nkSurname2: ['', [Validators.required]],
        nkRelationship2: ['', [Validators.required]],

        bussAddrPlot: ['', []], // removed required
        bussAddrSuburb: ['', []], // removed required
        bussAddrTown: ['', []],
        bussAddrCountry: ['', []], // removed required
        bussAddrTradingAs: ['', []],
        disability: ['', [Validators.required]],
        disabilityType: ['', []],
        disabilityDocuments: [[], []],
        creditCheck: ['', []],
        fillStatus: [false],
      },
      {
        updateOn: 'change',
        validators: [differentKinAddressesValidator(), kinContactsWithinDifferentValidator()],
      },
    );

    // if loan application type is company
    if (this.loanApplicationType.toLowerCase() === 'company') {
      individualForm.get('creditCheck')?.setValidators(Validators.required);
    } else if (this.loanApplicationType.toLowerCase() === 'group') {
      individualForm.get('creditCheck')?.setValidators(Validators.required);
    } else if (
      this.loanApplicationType.toLowerCase() === 'mabogodinku' ||
      this.loanApplicationType.toLowerCase() === 'mabogo dinku'
    ) {
      individualForm.get('creditCheck')?.setValidators(Validators.required);
    } else if (this.loanApplicationType.toLowerCase() === 'individual') {
      individualForm.get('creditCheck')?.setValidators(Validators.required);
    }
    individualForm.updateValueAndValidity();

    individualForm
      .get('nationality')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((value: any) => {
        if (value === 'BW') {
          // console.log('Country is botswana');
          individualForm.get('gender')?.disable();
          individualForm.get('gender')?.clearValidators();
          individualForm
            .get('omangNumber')
            ?.addValidators([
              Validators.required,
              Validators.minLength(9),
              Validators.maxLength(9),
              Validators.pattern(/^\d{4}[12]\d{4}$/),
            ]);

          individualForm.get('dateOfOmangExpiry')?.addValidators([Validators.required]);

          individualForm.get('foreignPassportNumber')?.setValue('');
          individualForm.get('foreignPassportExpiry')?.setValue('');
          individualForm.get('foreignPassportNumber')?.clearValidators();
          individualForm.get('foreignPassportExpiry')?.clearValidators();
          individualForm.get('foreignPassportNumber')?.updateValueAndValidity();
          individualForm.get('foreignPassportExpiry')?.updateValueAndValidity();
        } else {
          // console.log('Country is not botswana');
          individualForm.get('gender')?.enable();
          individualForm.get('gender')?.addValidators([Validators.required]);
          individualForm.get('omangNumber')?.clearValidators();
          individualForm.get('dateOfOmangExpiry')?.clearValidators();

          individualForm.get('omangNumber')?.setValue('');
          individualForm.get('dateOfOmangExpiry')?.setValue('');

          individualForm.get('omangNumber')?.updateValueAndValidity();
          individualForm.get('dateOfOmangExpiry')?.updateValueAndValidity();

          individualForm.get('foreignPassportNumber')?.setValidators([Validators.required]);
          individualForm.get('foreignPassportExpiry')?.setValidators([Validators.required]);
          individualForm.get('foreignPassportNumber')?.updateValueAndValidity();
          individualForm.get('foreignPassportExpiry')?.updateValueAndValidity();
        }

        individualForm.updateValueAndValidity();
        // this.cdr.markForCheck();
      });

    individualForm.updateValueAndValidity();

    // Dyanmic Disability Options
    individualForm
      .get('disability')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((value: any) => {
        if (value === true || value === 'true') {
          individualForm.get('disabilityType')?.setValidators(Validators.required);
        } else {
          individualForm.get('disabilityType')?.clearValidators();
          individualForm.get('disabilityType')?.setValue(null);
        }

        individualForm.get('disabilityType')?.updateValueAndValidity();
      });

    // if credit check is without clearance certificate
    individualForm
      .get('creditCheck')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((value: any) => {
        if (value === 'adverseWithoutClearanceCertificate') {
          this.nextDisableForCreditCheck = true;
        } else {
          this.nextDisableForCreditCheck = false;
        }
      });
    return individualForm;
  }

  private patchIndividualDetails() {
    if (!this.individualDetails || this.individualDetails.length === 0) {
      // console.log('individual has zero details or undefined');
      this.individualStateService.setIndividualCount(0);
      this.logger.debug('No Individual Details Found, Patch Individual Not Performed');
      return;
    }

    this.updateQueryParamForIndividualCount(this.individualDetails.length);

    this.numberOfIndividuals = this.individualDetails.length;
    this.individualStateService.setIndividualCount(this.individualDetails.length);
    this.individualStateService.setIndividualData(this.individualDetails);

    // MabogoDinku Application Should Have minimum 5
    if (this.numberOfIndividuals < 5) {
      // this.numberOfIndividuals = 5;
      // this.addIndividualsMabogoDinku(5);
    }

    this.addIndividuals(this.numberOfIndividuals);

    this.individualDetails.forEach((individual, individualIndex) => {
      const individualForm = this.individualList.controls[individualIndex] as FormGroup;
      individualForm.patchValue(individual);

      if (!this.isApplicationDisabled) {
        // individualForm.get('omangNumber')?.markAsTouched();
      }

      individualForm.get('gender')?.disable();

      this.setCountryCodeAndNumber(individualForm, individual.nkContact, 'nkContact');
      this.setCountryCodeAndNumber(individualForm, individual.nkContact2!, 'nkContact2');

      this.setCountryCodeAndNumber(
        individualForm,
        individual.secondaryMobileNumber!,
        'secondaryMobileNumber',
      );
      this.setCountryCodeAndNumber(
        individualForm,
        individual.otherContactNumber,
        'otherContactNumber',
      );

      this.handleMobileNumber(individualForm, individual.mobileNumber);
      this.handleEmailAddress(individualForm, individual.emailAddress);

      // this.individualFormValid.emit(this.individualForm.valid);
      this.individualFormValidityAndProgress.emit({
        validity: this.individualForm.valid,
        progress: this.calculateProgress(),
      });

      // individualForm.updateValueAndValidity({ emitEvent: true });
      // this.individualForm.updateValueAndValidity();
    });
  }

  // ----------------- ACTION ON INDIVIDUAL FORM CHANGES ---------------

  public actionOnOmangNumberValueChange() {
    // this.actionOnIndividualFormChanges();
    // Clear Previous Subscription
    this.omangNumberSubscriptions.forEach((sub) => sub.unsubscribe());
    this.omangNumberSubscriptions = [];
    const size = this.individualList.length;
    let omangNumberMap = new Map<number, string>();
    for (let i = 0; i < size; i++) {
      const individualDetailsGroup = this.individualList.at(i);
      let sub = individualDetailsGroup
        .get('omangNumber')!
        .valueChanges.pipe(takeUntilDestroyed(this.destoryRef))
        .subscribe((value: any) => {
          let omangNumberValue = value;
          // Validate Omang Number
          if (
            omangNumberValue === null ||
            omangNumberValue === undefined ||
            omangNumberValue === ''
          ) {
            return;
          }
          if (omangNumberValue.length === 9) {
            omangNumberMap.set(i, omangNumberValue);
            if (omangNumberValue[4] === '1') {
              individualDetailsGroup.get('gender')?.setValue('M'); // Setting gender to male
            } else if (omangNumberValue[4] === '2') {
              individualDetailsGroup.get('gender')?.setValue('F');
            }
          } else {
            omangNumberMap.set(i, '');
            individualDetailsGroup.get('gender')?.setValue('');
          }
          if (omangNumberValue.length === 9) {
            let hasValue = false;
            for (let j = 0; j < size; j++) {
              if (i !== j && omangNumberMap.get(j) === omangNumberValue) {
                hasValue = true;
                break;
              } else {
                hasValue = false;
              }
            }
            if (hasValue) {
              // Swal.fire({
              //   title: 'Duplicate Omang Number',
              //   text: 'Omang Number already exists in the list of individuals. Please enter a different Omang Number.',
              //   icon: 'error',
              //   confirmButtonText: 'Ok',
              // }).then((result) => {
              //   if (result.isConfirmed) {
              //     individualDetailsGroup
              //       .get('omangNumber')
              //       ?.setValue(omangNumberValue.substring(0, omangNumberValue.length - 1));
              //   }
              // });
            }
          }
        });
      if (sub) {
        this.omangNumberSubscriptions.push(sub);
      }
    }
  }

  // =================== Private Methods ============================

  private individualFormInit() {
    // get user data from storage
    const userData = this.storage.get('user-data');

    // parse user details from JSON and cast to IbUserModel interface
    const userDetails = JSON.parse(userData) as IbUserModel;

    // set username, sessionId and applicationId for form
    this.username = userDetails.genericServiceBean.newLoginBean.loginId;
    this.sessionId = userDetails.sessionId;
    this.applicationId = this.activeRoute.snapshot.queryParamMap.get('applicationId')!;
    this.loanApplicationType = this.activeRoute.snapshot.queryParamMap.get(
      'loanType',
    ) as LoanApplicationType;

    // console.log('application Id snapshot: ', this.applicationId);
    // console.log('loan type snapshot: ', this.loanApplicationType);

    // create individualForm using FormBuilder with default values
    this.individualForm = this.formBuilder.group(
      {
        applicationId: [''],
        sessionId: [''],
        username: [''],
        individualList: this.formBuilder.array([this.createIndividual()], { updateOn: 'change' }),
      },
      {
        updateOn: 'change',
        validators: [omangNumberUniqueValidator(), primaryMobileNumberUniqueValidator()],
      },
    );

    // patch default values for applicationId, sessionId and username
    this.individualForm.patchValue({
      applicationId: this.applicationId,
      sessionId: this.sessionId,
      username: this.username,
    });

    // add 5 individuals if it has mabogo dinku application
    if (
      this.individualList.length < 5 &&
      (this.loanApplicationType === 'mabogoDinku' ||
        this.loanApplicationType === 'mabogodinku' ||
        this.loanApplicationType === 'Mabogo Dinku')
    ) {
      // this.addIndividuals(5);
    }

    this.actionOnOmangNumberValueChange(); // use create individual and manage subscription manually and channge the omange number and gender dynamically
  }

  private onIndividualFormStatusChange() {
    this.individualList.valueChanges
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((res: any) => {
        // console.log('individual value changes: ', res);
        const progress = this.calculateProgress();
        this.individualFormValidityAndProgress.emit({
          validity: this.individualForm.valid,
          progress,
        });
      });
  }

  private handleMobileNumber(individualForm: FormGroup, mobileNumber: string) {
    if (mobileNumber.length > 0) {
      this.setCountryCodeAndNumber(individualForm, mobileNumber, 'mobileNumber');

      individualForm.patchValue({
        mobileNumberStatus: 'VERIFIED',
      });

      individualForm.get('mobileNumber')?.disable();
      individualForm.get('mobileNumberCountryCode')?.disable();
    } else {
      individualForm.patchValue({
        mobileNumberStatus: 'NOT_VERIFIED',
        mobileNumberCountryCode: '267',
      });

      individualForm.get('mobileNumber')?.enable();
      individualForm.get('mobileNumberCountryCode')?.enable();
    }
  }

  private handleEmailAddress(individualForm: FormGroup, emailAddress: string) {
    if (emailAddress.length > 0) {
      individualForm.patchValue({
        emailAddressStatus: 'VERIFIED',
      });

      individualForm.get('emailAddress')?.disable();
    } else {
      individualForm.patchValue({
        emailAddressStatus: 'NOT_VERIFIED',
      });

      individualForm.get('emailAddress')?.enable();
    }
  }

  private setCountryCodeAndNumber(
    individualForm: FormGroup,
    number: string,
    formControlName: string,
  ) {
    if (number && number.length > 0) {
      let [countryCode, numberOnly] = number.split('-');

      if (!countryCode) {
        countryCode = '267';
      }

      individualForm.patchValue({
        [formControlName]: numberOnly,
        [`${formControlName}CountryCode`]: countryCode,
      });
    }
  }

  public emailChanges(event: any, index: number) {
    const email = event.target.value;
    const individualForm = this.individualList.controls[index] as FormGroup;
    if (email.length > 0) {
      // If the email value is not empty, add a validator to the 'emailAddressStatus' FormControl.
      individualForm.get('emailAddressStatus')?.addValidators(Validators.pattern('VERIFIED'));
    } else {
      // If the email value is empty, clear any validators set on the 'emailAddressStatus' FormControl.
      individualForm.get('emailAddressStatus')?.clearValidators();
    }
  }

  // ------ Verify Email and Mobile

  public openOtpVerificationPopup(type: 'PHONE' | 'EMAIL' | 'NONE', index: number) {
    const contact =
      type === 'PHONE'
        ? this.individualList.controls[index].get('mobileNumberCountryCode')?.value +
          this.individualList.controls[index].get('mobileNumber')?.value
        : this.individualList.controls[index].get('emailAddress')?.value;

    if (contact.toString().trim().length === 0) {
      let errorMessage = '';
      if (type === 'PHONE') {
        errorMessage = 'Please enter a valid Mobile number to verify';
      } else if (type === 'EMAIL') {
        errorMessage = 'Please enter a valid email address to verify';
      }

      this.otpForm.reset();
      this.otpForm.get('codeDigit')?.reset();

      Swal.fire({
        title: 'Verification Failed',
        text: errorMessage,
        icon: 'error',
        heightAuto: false,
        confirmButtonText: 'Ok',
      }).then((result: any) => {
        if (result.isConfirmed) {
          type = 'NONE';
          return;
        }
      });

      return;
    }

    this.otpVerificationType = type;
    this.otpVerificationIndex = index;

    this.contactVerificationService
      .generateOtp(contact, type)
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((res: any) => {
        if (res.status === 'SUCCESS') {
          if (type === 'EMAIL') {
            // // console.log('Verify Eamil');
            this.otpVerificationType = 'EMAIL';
            this.otpVerificationIndex = index;
            this.otpVerificationPopup
              .open({
                config: {
                  container: 'body',
                  backdrop: 'static',
                  keyboard: false,
                  centered: true,
                  modalDialogClass: 'custom-modal-dialog',
                  windowClass: 'custom-window',
                  size: 'auto',
                  beforeDismiss: () => {
                    this.otpVerificationType = 'NONE';
                    this.otpVerificationIndex = -1;
                    return true;
                  },
                },
                data: {
                  title: 'Verify Email',
                  showFooter: false,
                },
              })
              .then((res) => ''); // // console.log(res));
          } else if (type === 'PHONE') {
            // // console.log('Verify Mobile');
            this.otpVerificationType = 'PHONE';
            this.otpVerificationIndex = index;
            this.otpVerificationPopup.open({
              config: {
                container: 'body',
                backdrop: 'static',
                keyboard: false,
                centered: true,
                modalDialogClass: 'modal-dialog-custom',
                windowClass: 'modal-custom',
                size: 'auto',
                beforeDismiss: () => {
                  this.otpVerificationType = 'NONE';
                  this.otpVerificationIndex = -1;
                  return true;
                },
              },
              data: {
                title: 'Verify Mobile',
                showFooter: false,
              },
            });
          }

          this.toastrService.success('OTP sent successfully', 'Success');
        } else {
          this.toastrService.error('OTP not sent', 'Error');
        }
      });
  }

  public reGenerateOtp() {
    const contact =
      this.otpVerificationType === 'PHONE'
        ? this.individualList.controls[this.otpVerificationIndex].get('mobileNumber')?.value
        : this.individualList.controls[this.otpVerificationIndex].get('emailAddress')?.value;

    this.contactVerificationService
      .generateOtp(contact, this.otpVerificationType)
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((res: any) => {
        if (res.status === 'SUCCESS') {
          this.toastrService.success('OTP sent successfully', 'Success');
          this.otpForm.reset();
          this.otpForm.get('codeDigit')?.reset();
        } else {
          this.toastrService.error('OTP not sent', 'Error');
        }
      });
  }

  public verifyContact(type: 'PHONE' | 'EMAIL' | 'NONE', index: number) {
    // const scrollY = window.scrollY;

    const codeDigit = this.otpForm.get('codeDigit')!;
    const firstDigit = codeDigit!.get('first')?.value;
    const secondDigit = codeDigit!.get('second')?.value;
    const thirdDigit = codeDigit!.get('third')?.value;
    const fourthDigit = codeDigit!.get('fourth')?.value;
    this.contactVerificationService
      .validateContact(`${codeDigit.value}`, type)
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((res: any) => {
        // this.otpVerificationPopup.close();

        let swalMessageTxt = '';
        if (type === 'EMAIL') {
          swalMessageTxt = 'Email Id verified successfully!';
        } else if (type === 'PHONE') {
          swalMessageTxt = 'Mobile Number verified successfully!';
        }

        if (res.status === 'SUCCESS') {
          Swal.fire({
            title: 'Success',
            text: swalMessageTxt,
            heightAuto: false,
            icon: 'success',
          }).then((result) => {
            if (result.isConfirmed) {
              this.otpVerificationPopup.close();
              // Close the popup logic here
              // window.scrollTo(0, scrollY);

              if (type === 'EMAIL') {
                // // console.log('Verify Eamil');

                this.individualList.controls[index].get('emailAddress')?.disable();

                this.individualList.controls[index].get('emailAddressStatus')?.disable();
                this.individualList.controls[index].get('emailAddressStatus')?.setValue('VERIFIED');

                this.emailAddress.nativeElement.classList.add('email-verified');
              } else if (type === 'PHONE') {
                // // console.log('Verify Mobile');
                this.individualList.controls[index].get('mobileNumber')?.disable();

                this.individualList.controls[index].get('mobileNumberStatus')?.disable();
                this.individualList.controls[index].get('mobileNumberStatus')?.setValue('VERIFIED');

                this.mobileNumber.nativeElement.classList.add('mobile-verified');
              }

              // this.toastrService.success('Contact verified successfully', 'Success');
              this.otpVerificationType = 'NONE';
              this.otpVerificationIndex = -1;
            } else {
              this.otpVerificationType = 'NONE';
              this.otpVerificationIndex = -1;
              // Close the popup logic here
              // window.scrollTo(0, scrollY);
            }

            this.otpForm.reset();
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Invalid OTP',
            icon: 'error',
            heightAuto: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.mobileNumber.nativeElement.classList.remove('mobile-verified');
              this.emailAddress.nativeElement.classList.remove('email-verified');
              this.otpForm.reset();
              this.otpForm.get('codeDigit')?.reset();
              // Close the popup logic here
              // window.scrollTo(0, scrollY);
            }
          });
        }
      });
  }
  public editContact(type: 'PHONE' | 'EMAIL', index: number) {
    if (type === 'EMAIL') {
      this.individualList.controls[index].get('emailAddress')?.enable();
      this.individualList.controls[index].get('emailAddressStatus')?.enable();
      this.individualList.controls[index].get('emailAddressStatus')?.setValue('NOT_VERIFIED');
    } else if (type === 'PHONE') {
      this.individualList.controls[index].get('mobileNumber')?.enable();
      this.individualList.controls[index].get('mobileNumberCountryCode')?.enable();
      this.individualList.controls[index].get('mobileNumberStatus')?.enable();
      this.individualList.controls[index].get('mobileNumberStatus')?.setValue('NOT_VERIFIED');
    }
  }

  // ------ Add and Remove Individual ---------
  private confirmationService = inject(ConfirmationService);
  public removeIndividual(individualIndex: number, event: any): void {
    // Display a confirmation dialog
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      icon: 'fa fa-exclamation-triangle text-danger',

      // If the user accepts the confirmation
      accept: () => {
        // check if there is individual details below 5 and more than 15 for mabogo dinku application
        if (
          (this.individualList.length <= 5 || this.individualList.length > 15) &&
          (this.loanApplicationType === 'mabogoDinku' ||
            this.loanApplicationType === 'mabogodinku' ||
            this.loanApplicationType === 'Mabogo Dinku')
        ) {
          // this.swalService.error(
          //   'Unable to remove individual shareholder',
          //   'You must have at least 5 shareholder and at max 15 shareholder to continue with Mabogo Dinku Application',
          // );
          // return;
        }

        // Check if there's only one individual in the list
        if (this.individualList.length === 1) {
          // Display an error message if there's only one individual
          this.swalService.error(
            'Unable to remove individual shareholder',
            'You must have at least one shareholder to continue the application',
          );
          return;
        }
        // Remove the individual at the specified index from the form array
        const individualList = this.individualForm.get('individualList') as FormArray;
        let removableIndividualDetails = individualList.at(individualIndex);
        let id = removableIndividualDetails.get('id')?.value || null;
        if (!!id) {
          this.http
            .post(environment.apiUrl + '/pfsvc/loan/deleteIndividuals', [id], {})
            .pipe(takeUntilDestroyed(this.destoryRef))
            .subscribe((res: any) => {
              if (res.status === 'SUCCESS') {
                individualList.removeAt(individualIndex);
                console.log('Removing Individual At ', individualIndex, ' with backend call');

                this.updateQueryParamForIndividualCount(individualList.length);
              } else {
                this.swalService.error(
                  'Error',
                  'Unable to remove individual / shareholder details, please try again',
                );
              }
            });
        } else {
          individualList.removeAt(individualIndex);
          console.log('Removing Individual At ', individualIndex, ' without backend call');
        }

        // Update the query parameter for individual count
        // this.updateQueryParamForIndividualCount(individualList.length);

        // Notify the parent component about the form validity and progress
        this.individualFormValidityAndProgress.emit({
          validity: this.individualForm.valid,
          progress: this.calculateProgress(),
        });
      },
      // If the user rejects the confirmation, do nothing
      reject: () => {
        return;
      },
    });
  }

  public async addIndividuals(numberOfIndividuals: number) {
    this.logger.trace('Add Individual Called with ', numberOfIndividuals, ' number of individuals');
    if (
      numberOfIndividuals > 15 &&
      (this.loanApplicationType === 'mabogoDinku' ||
        this.loanApplicationType === 'mabogodinku' ||
        this.loanApplicationType === 'Mabogo Dinku')
    ) {
      this.swalService.error(
        'Invalid Number of Individual Details',
        'You must have at least 5 shareholder and at max 15 shareholder to continue with Mabogo Dinku Application',
      );
      return;
    }

    // edge cases
    if (numberOfIndividuals <= 0) {
      this.swalService.error(
        'Invalid Number Of Individual',
        'You must have at least one shareholder to continue the application',
      );
      this.logger.error(
        'Invalid Number of Individual, You must have at least one shareholder to continue the application',
      );
      return;
    }

    const individualList = this.individualForm.get('individualList') as FormArray;
    const individualListLength = individualList.length;
    const effectiveLength = numberOfIndividuals - individualListLength;

    // If the effective length is negative, remove individuals from the end of the list
    if (effectiveLength < 0) {
      const numberOfRemovals = Math.abs(effectiveLength);
      for (let i = 0; i < numberOfRemovals; i++) {
        // individualList.removeAt(individualList.length - 1);

        // Remove the individual at the specified index from the form array

        let removableIndividualDetails = individualList.at(individualList.length - 1);
        let id = removableIndividualDetails.get('id')?.value || null;
        if (!!id) {
          let response: any = await lastValueFrom(
            this.http.post(environment.apiUrl + '/pfsvc/loan/deleteIndividuals', [id], {}),
          );

          if (response.status === 'SUCCESS') {
            individualList.removeAt(individualList.length - 1);
          } else {
            this.swalService.error(
              'Error',
              'Unable to remove individual / shareholder details, please try again',
            );
            this.logger.error(
              'Something went wrong while deleting the individual / shareholder, please investigate it.',
            );
          }
        } else {
          individualList.removeAt(individualList.length - 1);
        }
      }
    } else {
      // Otherwise, add individuals to the list
      for (let i = 0; i < effectiveLength; i++) {
        individualList.push(this.createIndividual());
      }
    }

    // this.saveApplicationOnAdd();
    // this.updateQueryParamForIndividualCount(individualList.length);

    // this.savePartialApplication();

    // Emit event to notify parent component about the form validity
    // this.individualFormValid.emit(this.individualForm.valid);
    this.individualFormValidityAndProgress.emit({
      validity: this.individualForm.valid,
      progress: this.calculateProgress(),
    });

    this.actionOnOmangNumberValueChange();
  }

  public async addIndividualsMabogoDinku(numberOfIndividuals: number) {
    // if (
    //   (numberOfIndividuals < 5 || numberOfIndividuals > 15) &&
    //   (this.loanApplicationType === 'mabogoDinku' ||
    //     this.loanApplicationType === 'mabogodinku' ||
    //     this.loanApplicationType === 'Mabogo Dinku')
    // ) {
    //   this.swalService.error(
    //     'Invalid Number of Individual Details',
    //     'You must have at least 5 shareholder and at max 15 shareholder to continue with Mabogo Dinku Application',
    //   );
    //   return;
    // }

    // edge cases
    if (numberOfIndividuals <= 0) {
      this.swalService.error(
        'Invalid Number Of Individual',
        'You must have at least one shareholder to continue the application',
      );
      return;
    }

    const individualList = this.individualForm.get('individualList') as FormArray;
    const individualListLength = individualList.length;
    const effectiveLength = numberOfIndividuals - individualListLength;

    // If the effective length is negative, remove individuals from the end of the list
    if (effectiveLength < 0) {
      const numberOfRemovals = Math.abs(effectiveLength);
      for (let i = 0; i < numberOfRemovals; i++) {
        // individualList.removeAt(individualList.length - 1);

        // Remove the individual at the specified index from the form array

        let removableIndividualDetails = individualList.at(individualList.length - 1);
        let id = removableIndividualDetails.get('id')?.value || null;
        if (!!id) {
          let response: any = await lastValueFrom(
            this.http.post(environment.apiUrl + '/pfsvc/loan/deleteIndividuals', [id], {}),
          );

          if (response.status === 'SUCCESS') {
            individualList.removeAt(individualList.length - 1);
          } else {
            this.swalService.error(
              'Error',
              'Unable to remove individual / shareholder details, please try again',
            );
          }
        } else {
          individualList.removeAt(individualList.length - 1);
        }
      }
    } else {
      // Otherwise, add individuals to the list
      for (let i = 0; i < effectiveLength; i++) {
        individualList.push(this.createIndividual());
      }
    }

    this.updateQueryParamForIndividualCount(individualList.length);

    // this.saveApplicationOnAdd();

    // Emit event to notify parent component about the form validity
    // this.individualFormValid.emit(this.individualForm.valid);
    this.individualFormValidityAndProgress.emit({
      validity: this.individualForm.valid,
      progress: this.calculateProgress(),
    });

    this.actionOnOmangNumberValueChange();
  }

  public async previousStep() {
    setTimeout(() => {
      this.previousStepMove.emit(true);
    }, 1000);
  }

  public async nextStep() {
    if (this.isApplicationDisabled) {
      this.nextStepMove.emit(true);
      this.individualFormValidityAndProgress.emit({
        validity: this.individualForm.valid,
        progress: this.calculateProgress(),
      });
    } else {
      const isSaved = await this.saveApplication();
      if (isSaved) {
        this.nextStepMove.emit(true);
      }
    }
  }

  public async saveApplication(): Promise<boolean> {
    // Extract form values and apply mobile number and email address formatting

    let size = this.individualList.length;
    this.individualStateService.setIndividualCount(this.individualList.length);
    this.individualStateService.setIndividualData(this.individualDetails);
    for (let i = 0; i < size; i++) {
      let individual = this.individualList.at(i);
      individual.get('fillStatus')?.setValue(individual.valid);
    }
    const formValues = this.individualForm.getRawValue() as IndividualsCreateBody;
    this.formatIndividualContactInfo(formValues);

    // Create the payload for saving the application
    const saveApplicationPayload = this.createIndividualPayload(formValues);

    this.logger.trace('Save Individual Application Payload', saveApplicationPayload);

    try {
      // Save the application and handle the response
      const res = await lastValueFrom(
        this.loanApplicationService.saveIndividualLoanApplicationMabogoDinku(
          saveApplicationPayload,
        ),
      );

      this.logger.trace('Application Saved: Response is, ', res);

      const response = res as IndividualsCreateResponse;
      const updatedResponse = response.data.indviduals as IndividualsCreateBody;
      this.logger.trace('Current Individual List: ', this.individualList);
      // Clear the individualList and patch the form with the response
      this.individualList.clear();
      this.logger.trace('After Clear Individual List: ', this.individualList);
      this.individualForm.patchValue(updatedResponse);
      this.logger.trace('IndividualForm Patched With Updated Response ', this.individualForm.value);
      this.individualDetails = updatedResponse.individualList;
      this.logger.trace('Added Individual Details From Response: ', this.individualDetails);

      this.logger.trace('--------- Patch Individual Details Start ------');
      this.patchIndividualDetails();
      this.logger.trace('--------------- Patch Individual Details End-----');
      this.logger.log('After Patch: Individual Details: ', this.individualDetails);
      this.logger.log('After Patch: Individual Form Data', this.individualForm.value);

      this.individualList.updateValueAndValidity();

      // Show any remaining required fields
      let requiredFieldsForIndividuals = this.getMandatoryFieldsForIndividuals();
      if (requiredFieldsForIndividuals.length > 0) {
        this.showRequiredFields(requiredFieldsForIndividuals);

        if (this.individualForm.errors) {
          requiredFieldsForIndividuals.map((value: string[]) =>
            value.push(...Object.keys(this.individualForm.errors!)),
          );
        }

        this.loanApplicationRequiredField.setRequiredFileds(
          'individual_details',
          requiredFieldsForIndividuals,
        );
      } else {
        // Display success message and remove required fields if there are none
        this.toastrService.success('Application saved successfully', 'Success', {});
        this.loanApplicationRequiredField.removeRequiredFields('individual_details');
      }
      this.individualForm.markAllAsTouched();

      return true;
    } catch (err) {
      // Display error message if there's an issue with saving
      this.toastrService.error('Error saving application', 'Error', {});
      return false;
    }
  }

  public async saveApplicationOnAdd(): Promise<boolean> {
    // Extract form values and apply mobile number and email address formatting

    let size = this.individualList.length;
    for (let i = 0; i < size; i++) {
      let individual = this.individualList.at(i);
      individual.get('fillStatus')?.setValue(individual.valid);
    }
    const formValues = this.individualForm.getRawValue() as IndividualsCreateBody;
    this.formatIndividualContactInfo(formValues);

    // Create the payload for saving the application
    const saveApplicationPayload = this.createIndividualPayload(formValues);

    try {
      // Save the application and handle the response
      const res = await lastValueFrom(
        this.loanApplicationService.saveIndividualLoanApplicationMabogoDinku(
          saveApplicationPayload,
        ),
      );

      const response = res as IndividualsCreateResponse;
      const updatedResponse = response.data.indviduals as IndividualsCreateBody;

      // Clear the individualList and patch the form with the response
      this.individualList.clear();
      this.individualForm.patchValue(updatedResponse);
      this.individualDetails = updatedResponse.individualList;

      this.patchIndividualDetails();

      this.individualList.updateValueAndValidity();

      // Show any remaining required fields
      // let requiredFieldsForIndividuals = this.getMandatoryFieldsForIndividuals();
      // if (requiredFieldsForIndividuals.length > 0) {
      //   this.showRequiredFields(requiredFieldsForIndividuals);

      //   if (this.individualForm.errors) {
      //     requiredFieldsForIndividuals.map((value: string[]) =>
      //       value.push(...Object.keys(this.individualForm.errors!)),
      //     );
      //   }

      //   this.loanApplicationRequiredField.setRequiredFileds(
      //     'individual_details',
      //     requiredFieldsForIndividuals,
      //   );
      // } else {
      //   // Display success message and remove required fields if there are none
      //   this.toastrService.success('Application saved successfully', 'Success', {});
      //   this.loanApplicationRequiredField.removeRequiredFields('individual_details');
      // }
      // this.individualForm.markAllAsTouched();

      return true;
    } catch (err) {
      // Display error message if there's an issue with saving
      this.toastrService.error('Error saving application', 'Error', {});
      return false;
    }
  }

  public async savePartialApplication(): Promise<boolean> {
    // Extract form values and apply mobile number and email address formatting

    let size = this.individualList.length;
    for (let i = 0; i < size; i++) {
      let individual = this.individualList.at(i);
      individual.get('fillStatus')?.setValue(individual.valid);
    }
    const formValues = this.individualForm.getRawValue() as IndividualsCreateBody;
    this.formatIndividualContactInfo(formValues);

    // Create the payload for saving the application
    const saveApplicationPayload = this.createIndividualPayload(formValues);

    try {
      // Save the application and handle the response
      const res = await lastValueFrom(
        this.loanApplicationService.saveIndividualLoanApplication(saveApplicationPayload),
      );

      const response = res as IndividualsCreateResponse;
      const updatedResponse = response.data.indviduals as IndividualsCreateBody;

      // Clear the individualList and patch the form with the response
      this.individualList.clear();
      this.individualForm.patchValue(updatedResponse);
      this.individualDetails = updatedResponse.individualList;
      // console.log('save partial is calling form patch individuals');
      this.patchIndividualDetails();

      this.individualList.updateValueAndValidity();

      // Show any remaining required fields

      return true;
    } catch (err) {
      // Display error message if there's an issue with saving
      this.toastrService.error('Error saving application', 'Error', {});
      return false;
    }
  }

  private formatIndividualContactInfo(formValues: IndividualsCreateBody): void {
    const individualList = formValues.individualList;
    individualList.forEach((individual, index) => {
      // Formatting Kin Contact Details
      individual.nkContact = individual.nkContactCountryCode + '-' + individual.nkContact;
      individual.nkContact2 = individual.nkContact2CountryCode + '-' + individual.nkContact2;

      // Formatting Secondary Mobile and Other Contact Numbers
      individual.secondaryMobileNumber =
        individual.secondaryMobileNumberCountryCode + '-' + individual.secondaryMobileNumber;
      individual.otherContactNumber =
        individual.otherContactNumberCountryCode + '-' + individual.otherContactNumber;

      // Formatting Verified Mobile Number
      if (individual.mobileNumberStatus === 'VERIFIED') {
        individual.mobileNumber =
          individual.mobileNumberCountryCode + '-' + individual.mobileNumber;
      } else {
        formValues.individualList[index].mobileNumber = '';
      }

      // Clearing Email Address if it's NOT_VERIFIED
      if (individual.emailAddressStatus === 'NOT_VERIFIED') {
        formValues.individualList[index].emailAddress = '';
      }
    });
  }

  private getMandatoryFieldsForIndividuals(): string[][] {
    this.logger.trace('Inside Get Mandatory Fields for the individual details');
    const requiredFieldsForIndividuals: string[][] = [];
    for (let i = 0; i < this.individualDetails.length; i++) {
      const individualFormGroup = this.individualList.at(i) as FormGroup;
      const formControls = individualFormGroup.controls;
      const requiredFields: string[] = [];
      const fields = Object.keys(formControls);
      for (let j = 0; j < fields.length; j++) {
        const field = formControls[fields[j]];
        if (field.errors && RequiredIndividualFields[fields[j]]) {
          // console.log(fields[j], RequiredIndividualFields[fields[j]]);
          requiredFields.push(RequiredIndividualFields[fields[j]]);
        }
      }

      requiredFieldsForIndividuals.push(requiredFields);
    }

    this.logger.trace('Required Fileds to field: ', requiredFieldsForIndividuals);

    return requiredFieldsForIndividuals;
  }

  // -============== HELPER FUNCTION ================-
  private createIndividualPayload(updatedBody: IndividualsCreateBody): IndividualsCreateBody {
    const individualLists: IndividualDetailsModel[] = updatedBody.individualList;
    return {
      sessionId: updatedBody.sessionId,
      username: updatedBody.username,
      applicationId: updatedBody.applicationId,
      individualList: individualLists,
    };
  }

  public homeVillageAddressSameAsStandard(event: any, individual: AbstractControl, index: number) {
    if (event.target.checked) {
      const standardAddrPlot = individual.get('addrPlot')?.getRawValue();
      const standardSuburb = individual.get('addrSuburb')?.getRawValue();
      const standardTown = individual.get('addrTown')?.getRawValue();
      const standardCountry = individual.get('addrCountry')?.getRawValue();

      individual.patchValue({
        hvAddrPlot: standardAddrPlot,
        hvAddrSuburb: standardSuburb,
        hvAddrTown: standardTown,
        hvAddrCountry: standardCountry,
      });
    } else {
      individual.patchValue({
        hvAddrPlot: '',
        hvAddrSuburb: '',
        hvAddrTown: '',
        hvAddrCountry: '',
      });
    }
  }

  private updateQueryParamForIndividualCount(numberOfIndividuals: number) {
    // Get the current query parameters
    const queryParams = { ...this.activatedRoute.snapshot.queryParams };

    // Update the desired query parameter(s)
    queryParams.numberOfIndividuals = numberOfIndividuals;

    // Update the URL without navigating
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private birthDateRangeSetup() {
    // max birth date
    const today = new Date();
    const maxValidDate = new Date();
    maxValidDate.setFullYear(today.getFullYear() - 18);
    this.maxBirthDate = maxValidDate.toISOString().split('T')[0];

    // min birth date
    const minValidDate = new Date();
    minValidDate.setFullYear(today.getFullYear() - 100);
    this.minBirthDate = minValidDate.toISOString().split('T')[0];
  }

  private omangExpiryDateSetup() {
    // Get the current date
    const currentDate = new Date();

    // Create a new date with one month added to the current date
    const futureDate = new Date(currentDate);
    futureDate.setMonth(futureDate.getMonth() + 1);

    // If the future date goes into the next year, handle the edge case for December
    if (currentDate.getMonth() === 11 && futureDate.getMonth() === 0) {
      // Set the future date to the last day of February of the next year
      futureDate.setFullYear(currentDate.getFullYear() + 1, 1, 0);
    }

    // Format the future date as an ISO string
    const minDateOfOmangExpiry = futureDate.toISOString().split('T')[0];
    return minDateOfOmangExpiry;
  }

  // Calculate Progress of application
  private calculateProgress(): number {
    const totalRequiredSteps = this.individualList.controls.reduce((count, control) => {
      return count + this.countRequiredFields(control);
    }, 0);

    const completedRequiredSteps = this.individualList.controls.reduce((count, control) => {
      return count + this.countCompletedRequiredFields(control);
    }, 0);

    return (completedRequiredSteps / totalRequiredSteps) * 100;
  }

  private countRequiredFields(control: AbstractControl): number {
    if (!control) return 0;
    if (control instanceof FormGroup) {
      return Object.keys(control.controls).filter((controlName) => {
        // @ts-ignore
        return (
          control.controls[controlName].validator! &&
          // @ts-ignore
          control.controls[controlName].validator({} as AbstractControl) &&
          // @ts-ignore
          control.controls[controlName].validator({} as AbstractControl)!.required
        );
      }).length;
    } else {
      return 0;
    }
  }

  private countCompletedRequiredFields(control: AbstractControl): number {
    if (control instanceof FormGroup) {
      return Object.keys(control.controls).filter((controlName) => {
        const formControl = control.controls[controlName];
        return (
          formControl.valid &&
          formControl.validator &&
          formControl.validator({} as AbstractControl) &&
          formControl.validator({} as AbstractControl)!.required
        );
      }).length;
    } else {
      return 0;
    }
  }

  // ================ VALIDATION ===================
  public emailAddressValidity(emailId: string): any {
    if (emailId === null || emailId === undefined || emailId === '') {
      return false;
    }

    const email = emailId.trim();
    // either empty or valid email
    if (email.length === 0) {
      return true;
    }
    // const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const pattern = /(?:\w{3,})[\@][\w]+([.]{1}[\w]{2,}){1,}\b/g;
    return pattern.test(email);
  }

  public checkMobileValidity(mobileNumber: string, countryCode: string = '267'): any {
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

  public checkTelephoneValidity(telephoneNumber: string, countryCode: string = '267') {
    if (telephoneNumber === null || telephoneNumber === undefined || telephoneNumber === '') {
      return false;
    }

    const telephone = countryCode + '-' + telephoneNumber.trim();

    // let pattern = CountryMobileNumberRegex[countryCode];
    let pattern = /^267-\d{7,8}$/;
    if (pattern === undefined) {
      pattern = new RegExp(`^${countryCode}-\\d{1,}X*$`);
    }

    return pattern.test(telephone);
  }

  // Calculate and Show Required Field
  private showRequiredFields(requiredFieldsForIndividuals: any[]) {
    const size = requiredFieldsForIndividuals.length;

    if (size === 1) {
      const items = requiredFieldsForIndividuals[0];

      if (items.length === 0) {
        this.toastrService.success('Application saved successfully', 'Success', {});
        return;
      }

      const itemsHtml = items.map(
        (item: string) => `<li class="list-item text-start">${item} </li>`,
      );

      this.swalService.success('', '', {
        title: 'Application Saved',
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
    } else if (size > 1) {
      let allItemsHtml = '';

      let isAllEmpty = true;

      for (let i = 0; i < size; i++) {
        const items = requiredFieldsForIndividuals[i];

        if (items.length > 0) {
          isAllEmpty = false;
        }

        const headings = 'Required Fields For Individual ' + (i + 1).toString();
        const itemsHtml = items.map(
          (item: string) => `<li class="list-item text-start">${item} </li>`,
        );

        const combineHTML = `
        <div class="fs-3 mt-3 mb-1 py-3 bg-light-primary">${headings}</div>
        <ul class="list">
          ${itemsHtml.join('')}
        </ul>
        `;

        allItemsHtml += combineHTML;
      }

      if (isAllEmpty) {
        this.toastrService.success('Application saved successfully', 'Success', {});
        return;
      }

      this.swalService.success('', '', {
        title: 'Application Saved Successfully',

        html: `
      <div class="d-flex flex-column g-4">
        <div class="fs-4">
          Please make sure to enter all required field below to move to next step
        </div>
          ${allItemsHtml}
      </div>
    `,
        customClass: {
          container: '',
          popup: '',
          title: 'custom-title',
          confirmButton: '',
          icon: '',
        },
        width: '500px',

        confirmButtonText: 'OK',
      });
    }
  }

  public getDuplicateOmangNumbers(currentIndex: number): string {
    if (this.individualForm?.errors?.omangNumberNotUnique) {
      const duplicateIndices = this.individualForm.errors.omangNumberNotUnique
        .filter((item: number) => item !== currentIndex)
        .map((value: number) => value + 1);

      return duplicateIndices.join(', ');
    }
    return '';
  }
}
