import { AsyncPipe, NgClass, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { ValidateUserResponseModel } from '../../../modules/auth/components/forgot-login-id/forgot-login-id.model';
import { ForgotLoginIdService } from '../../../modules/auth/components/forgot-login-id/forgot-login-id.service';
import { RegistrationCaptchaComponent } from '../../../modules/auth/components/registration/registration-captcha/registration-captcha.component';
import { LottieAnimationComponent } from '../../../shared/ui/components/lottie-animation/lottie-animation.component';
import { NotificationComponent } from '../../../shared/ui/components/notification/notification.component';
import { OtpInputComponent } from '../../../shared/ui/components/otp-input/otp-input.component';
import { PasswordInputComponent } from '../../../shared/ui/components/password-input/password-input.component';
import { TelCountryCodeComponent } from '../../../shared/ui/components/tel-country-code/tel-country-code.component';
import { ClickableDirective } from '../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { DigitOnlyDirective } from '../../../shared/ui/directives/dom-event-directives/only-digit-input.directive';
import { CountryMobileNumberRegex } from '../../loan-application-management/loan-application-steps/individual-form/country-code-regex';

@Component({
  selector: 'app-authentication-forgot-login-id',
  standalone: true,
  imports: [
    NgSwitch,
    NgStyle,
    NgSwitchCase,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    BsDatepickerModule,
    RegistrationCaptchaComponent,
    NotificationComponent,
    AsyncPipe,
    PasswordInputComponent,
    OtpInputComponent,
    TelCountryCodeComponent,
    DigitOnlyDirective,
    ClickableDirective,
    LottieAnimationComponent,
    RouterLink,
    InlineSVGModule,
  ],
  templateUrl: './authentication-forgot-login-id.component.html',
  styleUrls: ['./authentication-forgot-login-id.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ForgotLoginIdService, ToastrService],
})
export class AuthenticationForgotLoginIdComponent implements OnInit {
  forgotLoginIdStep$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  errorMessage: string = '';

  forgotLoginIdForm: FormGroup;
  minDateOfBirth: string;
  maxDateOfBirth: string;

  currentSessionId: string;
  constructor(
    private destroyRef: DestroyRef,
    private forgotLoginIdService: ForgotLoginIdService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,

    private renderer: Renderer2,
  ) {
    // max birth date
    const today = new Date();
    const maxValidDate = new Date();
    maxValidDate.setFullYear(today.getFullYear() - 18);
    this.minDateOfBirth = maxValidDate.toISOString().split('T')[0];

    // min birth date
    const minValidDate = new Date();
    minValidDate.setFullYear(today.getFullYear() - 100);
    this.maxDateOfBirth = minValidDate.toISOString().split('T')[0];
  }

  ngOnInit() {
    // this.initializeBsDatepickerConfig();
    this.initializeForgotLoginIdForm();
  }

  ngAfterViewInit() {}

  // Initialize the form
  initializeForgotLoginIdForm() {
    this.forgotLoginIdForm = new FormGroup(
      {
        mobileNumber: new FormControl('', []),
        otp: new FormControl('', []),
        bpNumber: new FormControl('', []),
        dateOfBirth: new FormControl('', []),
        verificationType: new FormControl<'MOBILE' | 'BPNUMBER'>('MOBILE', []),
        mobileCountryCode: new FormControl('267', []),
      },
      {
        updateOn: 'change',
      },
    );
  }

  // Getters for form controls
  get fc() {
    return this.forgotLoginIdForm.controls;
  }

  // Checkbox
  onSwitchboxChanges(check: boolean) {
    this.forgotLoginIdForm.patchValue({
      verificationType: check ? 'MOBILE' : 'BPNUMBER',
    });

    if (this.forgotLoginIdForm.get('verificationType')?.value === 'MOBILE') {
    } else {
    }
  }

  // Proceed to the verification step
  proceedForVerification() {
    // Neet to remove this
    if (this.forgotLoginIdForm.get('verificationType')?.value === 'MOBILE') {
      if (
        this.forgotLoginIdForm.get('mobileNumber')?.value === '' ||
        this.forgotLoginIdForm.get('mobileNumber')?.value === null
      ) {
        Swal.fire({
          title: 'Error',
          text: 'Please enter your mobile number',
          icon: 'error',
          confirmButtonText: 'Enter Again',
          heightAuto: false,
        });
        return;
        // start with 7 and total 8 digit long
        // regex = ^7[0-9]{7}$
      } else if (
        !this.isMobileNumberValid(this.fc.mobileNumber.value, this.fc.mobileCountryCode.value)
      ) {
        Swal.fire({
          title: 'Error',
          text: 'Please enter a valid mobile number',
          icon: 'error',
          confirmButtonText: 'Enter Again',
          heightAuto: false,
        });
        return;
      }

      if (
        this.forgotLoginIdForm.get('dateOfBirth')?.value === '' ||
        this.forgotLoginIdForm.get('dateOfBirth')?.value === null
      ) {
        Swal.fire({
          title: 'Error',
          text: 'Please enter your date of birth',
          icon: 'error',
          confirmButtonText: 'Enter Again',
          heightAuto: false,
        });

        return;
      }

      // min 18
      if (this.forgotLoginIdForm.get('dateOfBirth')?.value !== '') {
        const dateOfBirth = new Date(this.forgotLoginIdForm.get('dateOfBirth')?.value);
        const today = new Date();
        const maxValidDate = new Date();
        maxValidDate.setFullYear(today.getFullYear() - 18);

        if (dateOfBirth > maxValidDate) {
          Swal.fire({
            title: 'Invalid DOB',
            text: 'You must be 18 years old',
            icon: 'error',
            confirmButtonText: 'Enter Again',
            heightAuto: false,
          });
          return;
        }
      }

      // max 100
      if (this.forgotLoginIdForm.get('dateOfBirth')?.value !== '') {
        const dateOfBirth = new Date(this.forgotLoginIdForm.get('dateOfBirth')?.value);
        const today = new Date();
        const minValidDate = new Date();
        minValidDate.setFullYear(today.getFullYear() - 100);

        if (dateOfBirth < minValidDate) {
          Swal.fire({
            title: 'Invalid DOB',
            text: 'You must be blow 100 Year old.',
            icon: 'error',
            confirmButtonText: 'Enter Again',
            heightAuto: false,
          });
          return;
        }
      }
    }

    const payload = this.forgotLoginIdForm.value;
    payload.mobileNumber = payload.mobileCountryCode + payload.mobileNumber;

    this.forgotLoginIdService.checkUser(payload).subscribe((res: ValidateUserResponseModel) => {
      if (res.status === 'SUCCESS') {
        this.forgotLoginIdStep$.next(1);
        this.currentSessionId = res.sessionId;
      } else {
        this.forgotLoginIdStep$.next(3); // User Not Found
        this.errorMessage = res.statusDesc;
        this.forgotLoginIdForm.get('otp')?.clearValidators();
        this.forgotLoginIdForm.reset();
        this.forgotLoginIdForm.get('verificationType')?.setValue('MOBILE');
        this.forgotLoginIdForm.get('mobileCountryCode')?.setValue('267');
      }
    });
  }

  verifyIdentity() {
    if (this.forgotLoginIdForm.get('otp')?.value === '') {
      this.toast.error('Please enter OTP');
      return;
    }

    this.forgotLoginIdService
      .validateOtp(this.forgotLoginIdForm.value, this.currentSessionId)
      .subscribe((res: any) => {
        if (res.status === 'SUCCESS') {
          this.forgotLoginIdStep$.next(2);
        } else {
          this.forgotLoginIdStep$.next(3);
          this.errorMessage = res.statusDesc;
        }
      });
  }

  // Validate Mobile Number
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
}
