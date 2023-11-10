/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { AsyncPipe, NgClass, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  ViewChild,
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
// import { passwordValidator } from '@shared/utils/custom-validators';
import {
  BsDatepickerConfig,
  BsDatepickerDirective,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HttpLoaderService } from '../../../../core/services/http-loader.service';
import { AuthService } from '../../../../features/authentication/services/auth.service';
import { OtpInputComponent } from '../../../../shared/ui/components/otp-input/otp-input.component';
import { PasswordInputComponent } from '../../../../shared/ui/components/password-input/password-input.component';
import { TelCountryCodeComponent } from '../../../../shared/ui/components/tel-country-code/tel-country-code.component';
import { CustomValidators } from '../../../../shared/utils/custom-validators';
import { CaptchaRequestData, CaptchaResponsePayload } from './models/captcha.model';
import { RegisterRequestData, RegisterResponsePayload } from './models/register.model';
import { RegistrationCaptchaComponent } from './registration-captcha/registration-captcha.component';
import { CaptchaService } from './services/captcha.service';
import { RegistrationService } from './services/registration.service';

enum RegistrationSteps {
  SignUpStep,
  TwoFactorStep,
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    BsDatepickerModule,
    RegistrationCaptchaComponent,

    AsyncPipe,
    PasswordInputComponent,
    OtpInputComponent,
    TelCountryCodeComponent,
  ],
})
export class RegistrationComponent implements OnInit, OnDestroy {
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
            Validators.required,
            Validators.pattern(/^7\d{3}\d{4}$/), // removed country code
          ]),
        ],

        loginId: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
        captcha: [null, Validators.compose([Validators.required])],

        // Details required for new user
        firstName: [null, Validators.compose([Validators.required])],
        lastName: [null, Validators.compose([Validators.required])],
        gender: [null, Validators.compose([Validators.required])],
        dateOfBirth: [null, Validators.compose([Validators.required])],
      },
      {
        updateOn: 'change',
      },
    );

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

      // // console.log('Must Match');
      // // console.log('current password', currentPassword);
      // // console.log('new password', controlValue);
      // // console.log('re-enter new password', matchingControlValue);

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

      this.registrationForm.get('signUPForm')?.patchValue({
        firstName: null,
        lastName: null,
        gender: null,
        dateOfBirth: null,
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
    if (this.registrationStep === RegistrationSteps.TwoFactorStep) {
      if (this.twoFactorForm.invalid) {
        // this.notify.showInfo('Please enter valid OTP', 'Info');
        this._toastr.info('Invalid Otp Entered', 'Info');
        return;
      }

      if (this.setPasswordForm.invalid) {
        this._toastr.info('Please Check Your Password', 'Info');
        return;
      }

      // setTimeout(() => {
      //   this._toastr.success('OTP verified successfully', 'Success');
      // });

      setTimeout(() => {
        this._toastr.success(
          'Dear customer, you have successfully registered to IB application.',
          'Success',
        );
        this.router.navigate(['/auth/login']);
      }, 500);
    }

    if (this.registrationStep === RegistrationSteps.SignUpStep) {
      setTimeout(() => {
        this._toastr.success('OTP sent to your device', 'Success');
      });
    }

    this.registrationStep = this.registrationStep + 1;
    this.cdr.detectChanges();
  }

  previousStep() {
    this.registrationStep = this.registrationStep - 1;
    this.cdr.detectChanges();
  }

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

    const minAge = 18;
    // const maxAge = 100;
    const dateOfBirth = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();

    // const m = today.getMonth() - dateOfBirth.getMonth();
    if (age < minAge) {
      this._toastr.error('Age should be greater than 18', 'Error');
      return;
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
      DOB: dob,
    };

    // this.nextStep();

    this.captchaService.verifyCaptcha(captchaRequestData).then((res: CaptchaResponsePayload) => {
      if (res.status === 'SUCCESS') {
        this.nextStep();
      } else {
        this._toastr.error(res.statusDesc, 'Error');
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
      DOB: dob,
    };

    // console the payload object

    this.registrationService
      .registerCustomer(payloadData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const response = res as RegisterResponsePayload;
        if (response.status === 'SUCCESS') {
          this.nextStep();
          this.registrationForm.reset();
          this.twoFactorForm.reset();
          // this.twoFactorForm.get('codeDigit')?.reset();
        } else {
          this._toastr.error(res.statusDesc, 'Failed to register');

          this.previousStep();
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
    this.isNextDisabled = !checkValue;
  }

  // ======= Create Passsword Element =======
  @ViewChild('createPassword') createPasswordRef: any;
  // eslint-disable @angular-eslint/use-lifecycle-interface
  ngAfterContentInit() {
    // console.log('Create Password After Content Init', this.createPasswordRef);
  }

  ngAfterViewInit() {
    // console.log('Create Password Element Ref After View Init: ', this.createPasswordRef);
  }
}
