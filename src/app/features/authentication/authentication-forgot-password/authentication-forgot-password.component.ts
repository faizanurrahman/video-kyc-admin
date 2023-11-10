import { AsyncPipe, NgClass, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpLoaderService } from '../../../core/services/http-loader.service';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';
import {
  ResetPasswordCheckUserResponsePayload,
  ResetPasswordResponsePayload,
  ResetPasswordValidateOtpResponsePayload,
} from '../../../modules/auth/components/forgot-password-v2/forgot-password.model';
import { ForgotPasswordService } from '../../../modules/auth/components/forgot-password-v2/forgot-password.service';
import { OtpInputComponent } from '../../../shared/ui/components/otp-input/otp-input.component';
import { PasswordInputComponent } from '../../../shared/ui/components/password-input/password-input.component';
import { CustomValidators } from '../../../shared/utils/custom-validators';

enum ResetPasswordSteps {
  findAccountStep, // Find user account associated with login id.
  verifyAccountStep, // Verify user identity by sending a verification code to register mobile number.
  resetPasswordStep, // Reset user's password and update the database.
}

@Component({
  selector: 'app-authentication-forgot-password',
  standalone: true,

  templateUrl: './authentication-forgot-password.component.html',
  styleUrls: ['./authentication-forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgSwitch,
    NgSwitchCase,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgStyle,
    AsyncPipe,
    OtpInputComponent,
    PasswordInputComponent,
    InlineSVGModule,
  ],
})
export class AuthenticationForgotPasswordComponent implements OnInit, AfterViewInit {
  forgotPasswordForm: FormGroup;
  forgotPasswordStep: ResetPasswordSteps = ResetPasswordSteps.findAccountStep;

  findAccountForm: FormGroup;
  verifyOtpForm: FormGroup;
  resetPasswordForm: FormGroup;

  sessionId: string = '';

  backgroundImageUrl: string = '/assets/media/illustrations/forgot-password-illustration.svg';
  currentFocusInput: FormControl | null = null;

  public timeLeft: number = 60;
  public timeLeft$: Subject<number> = new Subject();
  private timeIntervalId: any;

  constructor(
    private fb: FormBuilder,
    public readonly swalTargets: SwalPortalTargets,
    private _router: Router,
    private _toastr: ToastrService,
    public loader: HttpLoaderService,
    private forgotPasswordService: ForgotPasswordService,
    private destroyRef: DestroyRef,
    private renderer: Renderer2,
    private swalService: SweetAlertService,
  ) {}

  ngAfterViewInit() {}

  get findAccountControl() {
    const formGroup = this.forgotPasswordForm.get('findAccountForm') as FormGroup;

    return formGroup.controls;
  }

  get verifyAccountControl() {
    const formGroup = this.forgotPasswordForm.get('verifyOtpForm') as FormGroup;
    return formGroup.controls;
  }

  get resetPasswordControl() {
    const formGroup = this.forgotPasswordForm.get('resetPasswordForm') as FormGroup;
    return formGroup.controls;
  }

  get currentStep() {
    return +this.forgotPasswordStep.toString();
  }

  get getCurrentFocusInputValue() {
    if (!!this.currentFocusInput) {
      return this.currentFocusInput.value;
    } else {
      return '';
    }
  }

  onInputFocus(event: any) {
    // // console.log('event', event);

    this.currentFocusInput = event;
    this.currentFocusInput?.markAsTouched();
    this.currentFocusInput?.markAsDirty();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.findAccountForm = this.fb.group(
      {
        loginId: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      },
      { updateOn: 'change' },
    );

    this.verifyOtpForm = this.fb.group(
      {
        otpDigits: ['', Validators.required],
      },

      { updateOn: 'change' },
    );

    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            CustomValidators.passwordValidator,
          ]),
        ],
        confirmPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
      {
        updateOn: 'change',
        validators: [this.passwordMatchReactiveValidator],
      },
    );

    this.forgotPasswordForm = this.fb.group(
      {
        findAccountForm: this.findAccountForm,
        verifyOtpForm: this.verifyOtpForm,
        resetPasswordForm: this.resetPasswordForm,
      },
      { updateOn: 'change' },
    );
  }

  passwordMatchReactiveValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    }

    g.get('confirmPassword')?.setErrors({ mismatch: true });

    return { mismatch: true };
  }

  findAccountFormSubmitted() {
    const loginId = this.findAccountControl.loginId.value;

    this.forgotPasswordService
      .checkUser(loginId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: ResetPasswordCheckUserResponsePayload) => {
        if (res.status === 'SUCCESS') {
          this.forgotPasswordStep = ResetPasswordSteps.verifyAccountStep;
          this.sessionId = res.sessionId;
          this.startTimer();
          this._toastr.success('OTP sent on registered mobile number', 'Success');
        } else {
          this.swalService.error(
            'Customer Does Not Exist in CEDA Online',
            'No customer is associated with the entered login ID',
          );
          this.forgotPasswordStep = ResetPasswordSteps.findAccountStep;
        }
      });
  }

  verifyAccountFormSubmitted() {
    const otp = this.verifyAccountControl.otpDigits.value;

    const loginId = this.findAccountControl.loginId.value;

    this.forgotPasswordService
      .validateOtp(loginId, otp, this.sessionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: ResetPasswordValidateOtpResponsePayload) => {
        if (res.status === 'SUCCESS') {
          this.forgotPasswordStep = ResetPasswordSteps.resetPasswordStep;
          this._toastr.success('OTP verified successfully', 'Success');
        } else {
          // this._toastr.error('Invalid Otp Entered', 'Error');
          this.swalService.error('Invalid OTP', 'OTP does not matched');
          this.forgotPasswordStep = ResetPasswordSteps.verifyAccountStep;
        }
      });
  }

  resetPasswordFormSubmitted(event: any) {
    const loginId = this.findAccountControl.loginId.value;
    const password = this.resetPasswordControl.password.value;
    const rePassword = this.resetPasswordControl.confirmPassword.value;

    this.forgotPasswordService
      .resetPassword(loginId, password, rePassword, this.sessionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: ResetPasswordResponsePayload) => {
        if (res.status === 'SUCCESS') {
          this.forgotPasswordStep = ResetPasswordSteps.resetPasswordStep;
          // this._toastr.success(
          //   'Dear customer, you have successfully changed your password.',
          //   'Success',
          // );
          this.swalService
            .success(
              'Password Changed',
              'Dear customer, you have successfully changed the password',
            )
            .then((result) => {
              this._router.navigate(['/auth/login']);
            });
          // this._router.navigate(['/auth/login']);
        } else {
          // this._toastr.error('Invalid Otp Entered', 'Error');
          this.swalService.error('Invalid OTP', 'OTP does not matched');
          this.forgotPasswordStep = ResetPasswordSteps.verifyAccountStep;
        }
      });
  }

  //   moveFocusToNextInputDigitCode(event: KeyboardEvent) {
  //     const target = event.target as HTMLInputElement;
  //     const nextInput = target.nextElementSibling as HTMLInputElement;
  //     const previousInput = target.previousElementSibling as HTMLInputElement;

  //     if (event.key === 'Backspace' || event.key === 'Delete') {
  //       if (previousInput) {
  //         previousInput.focus();
  //         previousInput.select();
  //       }
  //     } else if (
  //       target.value.length === target.maxLength &&
  //       event.key !== 'ArrowLeft' &&
  //       event.key !== 'ArrowRight'
  //     ) {
  //       if (nextInput) {
  //         nextInput.focus();
  //         nextInput.select();
  //       }
  //     } else if (event.key === 'ArrowLeft') {
  //       if (previousInput) {
  //         previousInput.focus();
  //         previousInput.select();
  //       }
  //     } else if (event.key === 'ArrowRight') {
  //       if (nextInput) {
  //         nextInput.focus();
  //         nextInput.select();
  //       }
  //     }
  //   }

  // Check Input Keyword is Numberic or not
  isNumberKey(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Timer Function

  startTimer() {
    this.timeLeft = 60;
    this.timeLeft$.next(60);
    this.timeIntervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timeLeft$.next(this.timeLeft);
      }

      if (this.timeLeft === 0) {
        this.timeLeft$.next(0);
      }
    }, 1000);
  }

  resetTimer() {
    clearInterval(this.timeIntervalId);
    this.startTimer();

    this._toastr.success('OTP sent successfully ', 'OTP SENT');
  }

  destroyTimer() {
    clearInterval(this.timeIntervalId);
  }

  ngOnDestroy() {
    this.destroyTimer();
  }
}
