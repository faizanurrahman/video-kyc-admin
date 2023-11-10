import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../../features/authentication/services/auth.service';
import { NotificationComponent } from '../../../../shared/ui/components/notification/notification.component';

// import {ToastrService} from "ngx-toastr";

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

enum FormSteps {
  FirstStep,
  SecondStep,
  ThirdStep,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [],
})
export class ForgotPasswordComponent implements OnInit {
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.forgotPasswordFormStep === FormSteps.SecondStep) {
      this.moveFocusToNextInputDigitCode(event);
    }

    // // console.log('keyEvent', event);
  }

  @ViewChild('notify')
  public readonly toast!: NotificationComponent;

  forgotPasswordForm: FormGroup;

  findAccountForm: FormGroup;
  verifyOtpForm: FormGroup;
  setPasswordForm: FormGroup;

  forgotPasswordFormStep: FormSteps = FormSteps.FirstStep;

  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;

  isLoading: boolean = false;
  showVirtualKeyboard: boolean = false;

  backgroundImageUrl: string = '/assets/media/illustrations/forgot-password-illustration.svg';
  currentFocusInput: FormControl | null = null;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _cdr: ChangeDetectorRef,
    public readonly swalTargets: SwalPortalTargets,
    private _router: Router,
    private _toastr: ToastrService,
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  get fcF() {
    const formGroup = this.forgotPasswordForm.get('firstStep') as FormGroup;
    return formGroup.controls;
  }

  get fcS() {
    const formGroup = this.forgotPasswordForm.get('secondStep') as FormGroup;
    return formGroup.controls;
  }

  get fcT() {
    const formGroup = this.forgotPasswordForm.get('thirdStep') as FormGroup;
    return formGroup.controls;
  }

  get currentStep() {
    return +this.forgotPasswordFormStep.toString();
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
        email: [
          'admin@demo.com',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
      },
      { updateOn: 'change' },
    );

    this.verifyOtpForm = this.fb.group(
      {
        otp: this.fb.group(
          {
            first: [
              '',
              Validators.compose([
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1),
                Validators.pattern('[0-9]*'),
              ]),
            ],
            second: [
              '',
              Validators.compose([
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1),
                Validators.pattern('[0-9]*'),
              ]),
            ],
            third: [
              '',
              Validators.compose([
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1),
                Validators.pattern('[0-9]*'),
              ]),
            ],
            fourth: [
              '',
              Validators.compose([
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1),
                Validators.pattern('[0-9]*'),
              ]),
            ],
          },
          {
            updateOn: 'change',
          },
        ),
      },
      { updateOn: 'change' },
    );

    this.setPasswordForm = this.fb.group(
      {
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
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
        validators: this.passwordMatchReactiveValidator,
      },
    );

    this.forgotPasswordForm = this.fb.group(
      {
        firstStep: this.findAccountForm,
        secondStep: this.verifyOtpForm,
        thirdStep: this.setPasswordForm,
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

  toggleVirtualKeyboard() {
    this.showVirtualKeyboard = !this.showVirtualKeyboard;
  }

  onVirtualKeyboardKeyClicked(key: string) {
    if (!this.currentFocusInput) {
      // // console.log('please focus input');
      this.toast.showInfo('Please focus input', '', {
        icon: undefined,
        position: 'top',
        customClass: {
          popup: 'bg-light-primary fw-bolder fs-5 border-danger border-1',
        },
      });
      return;
    }

    this.currentFocusInput.setValue(key);

    // detect changes
    this._cdr.detectChanges();
  }

  onFirstStepSubmit() {
    this.errorState = ErrorStates.NotSubmitted;

    // const forgotPasswordSubscr = this.authService
    //   .forgotPassword(this.fcF.email.value)
    //   .pipe(first())
    //   .subscribe((result: boolean) => {
    //     this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
    //   });
    // this.unsubscribe.push(forgotPasswordSubscr);

    // this.toastr.success('OTP sent to your email address', 'Success', {});

    setTimeout(() => {
      // this.toast.showSuccess('OTP verified successfully', 'Success', {});
      this._toastr.success('OTP sent on registered mobile number', 'Success');
    });

    this.nextStep();
  }

  onSecondStepSubmit() {
    // // console.log('onSecondStepSubmit');
    // // console.log('otp', this.fcS);
    // // console.log('value', this.forgotPasswordForm.value);
    this.nextStep();
    setTimeout(() => {
      // this.toast.showSuccess('OTP verified successfully', 'Success', {});
      this._toastr.success('OTP verified successfully', 'Success');
    });
  }

  onThirdStepSubmit() {
    // this.previousStep();

    this._router.navigate(['/auth/login']);
    setTimeout(() => {
      // this.toast.showSuccess('Password changed successfully', 'Success', {});
      this._toastr.success('Password changed successfully', 'Success');
    }, 500);
  }

  nextStep() {
    this.currentFocusInput = null;
    // this.toast.showSuccess('Next Step', 'successfully moved to next page');
    if (this.forgotPasswordFormStep === FormSteps.FirstStep) {
      this.forgotPasswordFormStep = FormSteps.SecondStep;
      return true;
    } else if (this.forgotPasswordFormStep === FormSteps.SecondStep) {
      this.forgotPasswordFormStep = FormSteps.ThirdStep;
      return true;
    }

    return false;
  }

  previousStep() {
    this.currentFocusInput = null;
    // this.toast.showQuestion('Previous Step', 'successfully moved to previous page', {
    //   position: 'top-start',
    //   customClass: {
    //     validationMessage: 'text-danger',
    //     popup: 'bg-light-danger'
    //   }
    // });
    if (this.forgotPasswordFormStep === FormSteps.SecondStep) {
      this.forgotPasswordFormStep = FormSteps.FirstStep;
      return true;
    } else if (this.forgotPasswordFormStep === FormSteps.ThirdStep) {
      this.forgotPasswordFormStep = FormSteps.SecondStep;
      return true;
    }

    return false;
  }

  moveFocusToNextInputDigitCode(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const nextInput = target.nextElementSibling as HTMLInputElement;
    const previousInput = target.previousElementSibling as HTMLInputElement;

    // if(target.value.length === target.maxLength) {
    //   if(event.key === 'Backspace')
    // }
    // else if (target.value.length !== target.maxLength) {
    //
    // }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (previousInput) {
        previousInput.focus();
        previousInput.select();
      }
    } else if (
      target.value.length === target.maxLength &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight'
    ) {
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    } else if (event.key === 'ArrowLeft') {
      if (previousInput) {
        previousInput.focus();
        previousInput.select();
      }
    } else if (event.key === 'ArrowRight') {
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  }
}
