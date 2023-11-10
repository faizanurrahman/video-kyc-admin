import {
  AsyncPipe,
  JsonPipe,
  NgClass,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import {
  BsDatepickerConfig,
  BsDatepickerDirective,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HttpLoaderService } from '../../../core/services/http-loader.service';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';
import { AuthService } from '../../../modules/auth';
import {
  CaptchaRequestData,
  CaptchaResponsePayload,
} from '../../../modules/auth/components/registration/models/captcha.model';
import {
  RegisterRequestData,
  RegisterResponsePayload,
} from '../../../modules/auth/components/registration/models/register.model';
import { RegistrationCaptchaComponent } from '../../../modules/auth/components/registration/registration-captcha/registration-captcha.component';
import { CaptchaService } from '../../../modules/auth/components/registration/services/captcha.service';
import { RegistrationService } from '../../../modules/auth/components/registration/services/registration.service';
import { DisclaimerService } from '../../../shared/data-access/disclaimer.service';
import { OtpInputComponent } from '../../../shared/ui/components/otp-input/otp-input.component';
import { PasswordInputComponent } from '../../../shared/ui/components/password-input/password-input.component';
import { TelCountryCodeComponent } from '../../../shared/ui/components/tel-country-code/tel-country-code.component';
import { AlphabetOnlyDirective } from '../../../shared/ui/directives/dom-event-directives/only-alphabet-input.directive';
import { CustomValidators } from '../../../shared/utils/custom-validators';
import { CountryMobileNumberRegex } from '../../loan-application-management/loan-application-steps/individual-form/country-code-regex';

enum RegistrationSteps {
  SignUpStep,
  TwoFactorStep,
}

@Component({
  selector: 'app-authentication-registration',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgStyle,
    BsDatepickerModule,
    RegistrationCaptchaComponent,

    AsyncPipe,
    PasswordInputComponent,
    OtpInputComponent,
    TelCountryCodeComponent,
    InlineSVGModule,
    AlphabetOnlyDirective,
    JsonPipe,
  ],
  templateUrl: './authentication-registration.component.html',
  styleUrls: ['./authentication-registration.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationRegistrationComponent {
  ngAfterViewInit() {}

  isExistingUser: boolean = false;

  // - Limiting age of new customer
  // - Minimum age should be 18 year from now
  lowerAgeLimitDate: Date = new Date();

  dateOfBirthRefConfig: Partial<BsDatepickerConfig> = {};
  @ViewChild('dateOfBirthRef') dateOfBirthRef: BsDatepickerDirective;

  // Registration form step
  registrationForm: FormGroup;
  signUPForm: FormGroup;
  twoFactorForm: FormGroup;
  setPasswordForm: FormGroup;
  registrationFormStep: RegistrationSteps = RegistrationSteps.SignUpStep;

  hasError: boolean;
  isLoading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _toastr: ToastrService,
    private captchaService: CaptchaService,
    public loader: HttpLoaderService,
    private cdr: ChangeDetectorRef,
    private registrationService: RegistrationService,
    private destroyRef: DestroyRef,
    private renderer: Renderer2,
    private swalService: SweetAlertService,
    private disclaimerService: DisclaimerService,
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }

    const today = new Date();
    const mustBe18YearsOld = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const mustBe100YearsOld = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate(),
    );

    this.dateOfBirthRefConfig = {
      maxDate: mustBe18YearsOld,
      minDate: mustBe100YearsOld,
      dateInputFormat: 'DD/MM/YYYY',
      //
      //  dateInputFormat: "",

      adaptivePosition: true,
      isAnimated: true,
    };
  }

  // getter and setter for registration form step
  get registrationStep() {
    return this.registrationFormStep;
  }

  set registrationStep(step: RegistrationSteps) {
    this.registrationFormStep = step;
  }

  get stepOneFC() {
    return this.signUPForm.controls;
  }

  get stepTwoFC() {
    return this.twoFactorForm.controls;
  }

  get stepThreeFC() {
    return this.setPasswordForm.controls;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.signUPForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      // // console.log('signUPForm', value);
    });

    this.signUPForm
      .get('dateOfBirth')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        // // console.log('dateOfBirth', value);
        this.dateOfBirthRef.bsValue = value;
      });
  }

  // Registration Form Init
  initializeForm() {
    // sign up form
    this.signUPForm = this.fb.group(
      {
        // Details required for existing user
        bpNumber: [null, Validators.compose([])],
        mobileNumberCountryCode: ['267', [Validators.required]],
        mobileNumber: [
          null,
          Validators.compose([
            Validators.required, // removed country code

            Validators.maxLength(13),
          ]),
        ],

        loginId: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(4),
            Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()\-_=+\\|/,.:;'"{}\[\]`~]*$/),
          ]),
        ],
        captcha: [null, Validators.compose([Validators.required])],

        // Details required for new user
        firstName: [null, Validators.compose([Validators.required])],
        lastName: [null, Validators.compose([Validators.required])],
        gender: [null, Validators.compose([Validators.required])],
        dateOfBirth: [null, Validators.compose([Validators.required])],
        omangNumber: ['', [Validators.required, Validators.pattern(/\b\d{4}[1-2]\d{4}\b/)]],
      },
      {
        updateOn: 'change',
      },
    );

    this.signUPForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        this.showErrorMessageDateOfBirth = false;
        this.omangShouldMatchGender = false;
      });

    // two factor form
    this.twoFactorForm = this.fb.group({
      // codeDigit: this.fb.group(
      //     {
      //         first: [
      //             '',
      //             Validators.compose([
      //                 Validators.required,
      //                 Validators.minLength(1),
      //                 Validators.maxLength(1),
      //                 Validators.pattern('[0-9]*'),
      //             ]),
      //         ],
      //         second: [
      //             '',
      //             Validators.compose([
      //                 Validators.required,
      //                 Validators.minLength(1),
      //                 Validators.maxLength(1),
      //                 Validators.pattern('[0-9]*'),
      //             ]),
      //         ],
      //         third: [
      //             '',
      //             Validators.compose([
      //                 Validators.required,
      //                 Validators.minLength(1),
      //                 Validators.maxLength(1),
      //                 Validators.pattern('[0-9]*'),
      //             ]),
      //         ],
      //         fourth: [
      //             '',
      //             Validators.compose([
      //                 Validators.required,
      //                 Validators.minLength(1),
      //                 Validators.maxLength(1),
      //                 Validators.pattern('[0-9]*'),
      //             ]),
      //         ],
      //     },
      //     {
      //         updateOn: 'change',
      //     },
      // ),
      otp: this.fb.control('', [Validators.required]),
    });

    // set password form
    this.setPasswordForm = this.fb.group(
      {
        password: [
          '',
          Validators.compose([Validators.required, CustomValidators.passwordValidator]),
        ],
        confirmPassword: [
          '',
          Validators.compose([Validators.required, CustomValidators.passwordValidator]),
        ],
      },
      {
        validators: [this.mustMatch('password', 'confirmPassword')],
        updateOn: 'change',
      },
    );

    // password match function

    // registration  form
    this.registrationForm = this.fb.group(
      {
        signUPForm: this.signUPForm,
        twoFactorForm: this.twoFactorForm,
        setPasswordForm: this.setPasswordForm,
      },
      {
        updateOn: 'change',
      },
    );
  }

  mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.get(controlName)?.value;
      const matchingControlValue = control.get(matchingControlName)?.value;
      let error: any = {};

      if (controlValue !== matchingControlValue && controlValue !== null) {
        error['mustMatch'] = true;
        return error;
      }

      // error = {};

      return null;
    };
  }

  //
  onChangeExistingUser(event: any) {
    // // console.log(event);
    this.isExistingUser = event;
    if (this.isExistingUser) {
      this.registrationForm.get('signUPForm')?.get('bpNumber')?.addValidators(Validators.required);

      this.registrationForm.get('signUPForm')?.get('firstName')?.clearValidators();
      this.registrationForm.get('signUPForm')?.get('lastName')?.clearValidators();
      this.registrationForm.get('signUPForm')?.get('gender')?.clearValidators();
      this.registrationForm.get('signUPForm')?.get('dateOfBirth')?.clearValidators();
      this.registrationForm.get('signUPForm')?.get('omangNumber')?.clearValidators();

      this.registrationForm.get('signUPForm')?.patchValue({
        firstName: null,
        lastName: null,
        gender: null,
        dateOfBirth: null,
        omangNumber: null,
      });

      // need to fix
    } else {
      this.registrationForm
        .get('signUPForm')
        ?.get('bpNumber')
        ?.removeValidators(Validators.required);

      this.registrationForm.get('signUPForm')?.get('firstName')?.setValidators(Validators.required);
      this.registrationForm.get('signUPForm')?.get('lastName')?.setValidators(Validators.required);
      this.registrationForm.get('signUPForm')?.get('gender')?.setValidators(Validators.required);
      this.registrationForm
        .get('signUPForm')
        ?.get('dateOfBirth')
        ?.setValidators(Validators.required);
      this.registrationForm
        .get('signUPForm')
        ?.get('omangNumber')
        ?.addValidators([Validators.required, Validators.pattern(/\b\d{4}[1-2]\d{4}\b/)]);

      this.registrationForm.get('signUPForm')?.patchValue({
        bpNumber: null,
      });
    }
  }

  // - Mobile Number should be numeric only
  isNumberKey(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    // this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  nextStep() {
    if (this.registrationStep === RegistrationSteps.SignUpStep) {
      setTimeout(() => {
        // this._toastr.success('OTP sent to your device', 'Success');
        this.swalService.success(
          'OTP Sent',
          'We have sent you an OTP to your registered mobile number. Please enter the correct OTP to proceed registration process',
        );
      });
    }

    this.registrationStep = this.registrationStep + 1;
    this.cdr.detectChanges();
  }

  previousStep() {
    this.registrationStep = this.registrationStep - 1;
    this.cdr.detectChanges();
  }

  showErrorMessageDateOfBirth: boolean = false;
  errorMessageDateOfBirth: string = '';
  omangShouldMatchGender: boolean = false;
  onSignUPFormSubmitted() {
    const bpNumber = this.signUPForm.get('bpNumber')?.value;
    const captcha = this.signUPForm.get('captcha')?.value;
    const loginId = this.signUPForm.get('loginId')?.value;
    const mobileNumber = this.signUPForm.get('mobileNumber')?.value;
    const firstName = this.signUPForm.get('firstName')?.value;
    const lastName = this.signUPForm.get('lastName')?.value;
    const gender = this.signUPForm.get('gender')?.value;
    const dob = this.signUPForm.get('dateOfBirth')?.value;
    const mobileNumberCountryCode = this.signUPForm.get('mobileNumberCountryCode')?.value;
    const omangNumber = this.signUPForm.get('omangNumber')?.value;

    // Extract year, month, and day components from the Date object
    const year = dob?.getFullYear();
    const month = String(dob?.getMonth() + 1).padStart(2, '0'); // Adding 1 to the month because January is 0-based
    const day = String(dob?.getDate()).padStart(2, '0');

    // Create the formatted date string in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;

    const minAge = 18;
    const maxAge = 100;
    const dateOfBirth = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();

    // const m = today.getMonth() - dateOfBirth.getMonth();
    if (age < minAge) {
      // this._toastr.error('Age should be greater than 18', 'Error');
      this.swalService.error('Age Constrain Failed', 'You must be 18 year old.');
      this.showErrorMessageDateOfBirth = true;
      this.errorMessageDateOfBirth = 'You must be 18 year old.';
      return;
    }

    if (age > maxAge) {
      // this._toastr.error('Age Must be below 100 year', 'Error');
      this.swalService.error('Age Constrain Failed', 'You must be below 100 year old.');
      this.showErrorMessageDateOfBirth = true;
      this.errorMessageDateOfBirth = 'You must be below 100 year old.';
      return;
    }

    if (!!omangNumber) {
      if (
        (omangNumber[4] === '2' && gender === 'M') ||
        (omangNumber[4] === '1' && gender === 'F')
      ) {
        this.swalService
          .error(
            'OMANG Number and Gender Mismatch',
            // eslint-disable-next-line max-len
            'The fifth digit of the OMANG Number should correspond to the gender. If it is 1, the gender should be Male, and if it is 2, the gender should be Female. Please check and correct the OMANG Number.',
          )
          .then(() => {
            // this.omangShouldMatchGender = true;
          });
        this.omangShouldMatchGender = true;

        return;
      }
    }

    const captchaRequestData: CaptchaRequestData = {
      TYPE: bpNumber && bpNumber.length > 0 ? 'WITH_BP' : 'WITHOUT_BP',
      BP_NUMBER: bpNumber,
      CAPTCHA_USER_ANSWER: captcha,
      IB_USERNAME: loginId,
      MOBILE_NO: mobileNumberCountryCode + mobileNumber, //todo: by defulat botswana country code added
      FIRST_NAME: firstName,
      LAST_NAME: lastName,
      GENDER: gender,
      DOB: formattedDate,
      ID_NUMBER: omangNumber,
    };

    // this.nextStep();

    this.captchaService.verifyCaptcha(captchaRequestData).then((res: CaptchaResponsePayload) => {
      if (res.status === 'SUCCESS') {
        this.nextStep();
      } else {
        // this._toastr.error(res.statusDesc, 'Error');
        this.swalService.error('Registration Failed', res.statusDesc);
      }
    });
  }

  onTwoFactorFormSubmitted() {
    this.nextStep();
  }

  onSetPasswordFormSubmitted(event: any) {
    const codeDigit = this.twoFactorForm.get('otp')!;
    const otp = codeDigit.value;
    const username = this.signUPForm.get('loginId')?.value;
    const mobileNumber = this.signUPForm.get('mobileNumber')?.value;
    const bpNumber = this.signUPForm.get('bpNumber')?.value;
    const password = this.setPasswordForm.get('password')?.value;
    const confirmPassword = this.setPasswordForm.get('confirmPassword')?.value;
    const firstName = this.signUPForm.get('firstName')?.value;
    const lastName = this.signUPForm.get('lastName')?.value;
    const gender = this.signUPForm.get('gender')?.value;
    const dob = this.signUPForm.get('dateOfBirth')?.value;
    const omangNumber = this.signUPForm.get('omangNumber')?.value;

    // Extract year, month, and day components from the Date object
    const year = dob?.getFullYear() || '';
    const month = String(dob?.getMonth() + 1).padStart(2, '0'); // Adding 1 to the month because January is 0-based
    const day = String(dob?.getDate()).padStart(2, '0');

    // Create the formatted date string in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;

    const payloadData: RegisterRequestData = {
      BP_NUMBER: bpNumber ? bpNumber : 'NA',
      IB_CONFIRM_PASSWORD: confirmPassword,
      IB_PASSWORD: password,
      IB_USERNAME: username,
      MOBILE_NO: mobileNumber,
      OTP: otp,
      TYPE: !!bpNumber ? 'WITH_BP' : 'WITHOUT_BP',
      FIRST_NAME: firstName,
      LAST_NAME: lastName,
      GENDER: gender,
      DOB: formattedDate,
      ID_NUMBER: omangNumber,
    };

    // console the payload object

    this.registrationService
      .registerCustomer(payloadData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const response = res as RegisterResponsePayload;
        if (response.status === 'SUCCESS') {
          setTimeout(() => {
            // this._toastr.success(
            //   'Dear customer, you have successfully registered to IB application.',
            //   'Success',
            // );

            this.swalService
              .success(
                'Registered Successfully',
                'Dear Customer, You have successfully registered at CEDA Online.',
              )
              .then((result) => {
                this.router.navigate(['/auth/login']);
                this.nextStep();
              });

            // this.router.navigate(['/auth/login']);
          }, 500);

          this.registrationForm.reset();
          this.twoFactorForm.reset();
          // this.twoFactorForm.get('codeDigit')?.reset();
        } else {
          // this._toastr.error(res.statusDesc, 'Failed to register');
          this.swalService.error('Registration Failed', res.statusDesc);

          // this.previousStep();
          this.twoFactorForm.reset();
          // this.twoFactorForm.get('codeDigit')?.reset();

          return;
        }
      });

    // // console.log('onSetPasswordFormSubmitted', this.setPasswordForm.value);

    // this.previousStep();
  }

  public isNextDisabled: boolean = true;

  firstDisclaimerChanged(checkValue: boolean) {
    // console.log('status changed');
    this.isNextDisabled = !checkValue;
  }

  // ======= Create Passsword Element =======
  @ViewChild('createPassword') createPasswordRef: any;
  // eslint-disable @angular-eslint/use-lifecycle-interface
  ngAfterContentInit() {
    // console.log('Create Password After Content Init', this.createPasswordRef);
  }

  @ViewChild('disclaimer1') disclaimerCheckbox: ElementRef<HTMLInputElement>;
  openRegistrationTermsAndCondition() {
    this.disclaimerService
      .showDisclaimerPopup('New User Registration Agreement', true)
      .then((result) => {
        if (result.isConfirmed) {
          this.disclaimerCheckbox.nativeElement.checked = true;
          this.firstDisclaimerChanged(this.disclaimerCheckbox.nativeElement.checked);
        } else {
          this.disclaimerCheckbox.nativeElement.checked = false;
          this.firstDisclaimerChanged(this.disclaimerCheckbox.nativeElement.checked);
        }
      });
  }

  public isMobileNumberValid(mobileNumber: string, countryCode: string = '267'): any {
    if (mobileNumber === null || mobileNumber === undefined || mobileNumber === '') {
      return false;
    }

    const mobile = countryCode + '-' + mobileNumber.trim();

    let pattern = CountryMobileNumberRegex[countryCode];
    // this.stepOneFC.mobileNumber.addValidators([Validators.pattern(pattern)]);
    if (pattern === undefined) {
      pattern = new RegExp(`^${countryCode}-\\d{1,}X*$`);
    }

    return pattern.test(mobile);
  }

  public switchButtonClick(checkbox: any) {
    checkbox.click();
    this.disclaimerCheckbox.nativeElement.checked = false;
    this.cdr.markForCheck();
  }
}
