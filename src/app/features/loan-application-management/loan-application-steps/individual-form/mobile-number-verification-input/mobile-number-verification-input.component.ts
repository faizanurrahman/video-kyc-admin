import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';

import Swal from 'sweetalert2';
import { SweetAlertService } from '../../../../../core/services/sweet-alert.service';
import { OtpInputComponent } from '../../../../../shared/ui/components/otp-input/otp-input.component';
import { TelCountryCodeComponent } from '../../../../../shared/ui/components/tel-country-code/tel-country-code.component';
import { DigitOnlyDirective } from '../../../../../shared/ui/directives/dom-event-directives/only-digit-input.directive';
import { PopupComponent } from '../../../../../_metronic/partials/layout/modals/popup/popup.component';
import { LoanApplicationContactVarificationService } from '../../../services/loan-application-contact-varification.service';
import { CountryMobileNumberRegex } from '../country-code-regex';

@Component({
  selector: 'app-mobile-number-verification-input',
  standalone: true,
  imports: [
    CommonModule,
    TelCountryCodeComponent,
    ReactiveFormsModule,
    FormsModule,
    NgbTooltipModule,
    PopupComponent,
    OtpInputComponent,
    DigitOnlyDirective,
  ],
  templateUrl: './mobile-number-verification-input.component.html',
  styleUrls: ['./mobile-number-verification-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MobileNumberVerificationInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MobileNumberVerificationInputComponent),
      multi: true,
    },
  ],
})
export class MobileNumberVerificationInputComponent
  implements ControlValueAccessor, Validator, OnInit
{
  @HostBinding('class') hostClass = 'flex-grow-1';
  @Input({ required: true }) isApplicationDisabled: boolean = false;
  @Input({ required: true }) countryCode: any = '267';
  @Input() isDisabled: boolean = false;

  @Output() mobileVerified: EventEmitter<boolean> = new EventEmitter();

  mobileNumberVerifyForm: FormGroup;
  otpForm: FormGroup;

  instanceCount: number = 1;

  constructor(
    private fb: FormBuilder,
    private swalService: SweetAlertService,
    private contactVerificationService: LoanApplicationContactVarificationService,
    private destroyRef: DestroyRef,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {
    this.mobileNumberVerifyForm = new FormGroup(
      {
        mobileNumber: new FormControl('', [Validators.required]),
        verificationStatus: new FormControl<'VERIFIED' | 'NOT_VERIFIED'>('NOT_VERIFIED', [
          Validators.required,
        ]),
      },
      { updateOn: 'change' },
    );

    this.mobileNumberVerifyForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        // console.log(value);
        if (value.verificationStatus === 'VERIFIED') {
          this.onChange(this.fc.mobileNumber.getRawValue());
          this.mobileVerified.emit(true);
        }
      });

    this.otpForm = this.fb.group(
      {
        codeDigit: new FormControl('', []),
      },
      {
        updateOn: 'change',
      },
    );
  }

  // ----- form events

  // ------- Form Control Value accessor implementation ----------
  writeValue(value: any): void {
    if (value === '' || value === undefined || value === null) return;
    if (value.length < 8) return;
    let splitValue = value.split('-');
    if (splitValue.length === 1) {
      this.fc.mobileNumber.setValue(splitValue[0], { emitEvent: false });
    } else {
      this.fc.mobileNumber.setValue(splitValue[1], { emitEvent: false });
    }

    if (this.instanceCount === 1 && value !== '') {
      // console.log('InstanceCount : ', this.instanceCount);
      if (value !== null && value !== undefined && value.toString().length > 1) {
        this.fc.verificationStatus.setValue('VERIFIED');
        this.fc.mobileNumber.disable();
        this.cdr.markForCheck();
      }
      // console.log('value: ', value);
      // console.log('verification: ', this.fc.verificationStatus);
      this.instanceCount++;
      // console.log('Instance Count Updated: ', this.instanceCount);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return null;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit(): void {
    if (this.fc.verificationStatus.value === 'VERIFIED') {
      this.onChange(this.fc.mobileNumber.value);
    }
  }

  // ---- fc getter
  get fc() {
    return this.mobileNumberVerifyForm.controls;
  }

  // --- validation of mobile number

  isMobileNumberValid(mobileNumberValue: string) {
    if (mobileNumberValue === null || mobileNumberValue === undefined || mobileNumberValue === '') {
      return false;
    }

    const mobile = this.countryCode + '-' + mobileNumberValue.trim();

    let pattern = CountryMobileNumberRegex[this.countryCode];
    if (pattern === undefined) {
      pattern = new RegExp(`^${this.countryCode}-\\d{1,}X*$`);
    }
    return pattern.test(mobile);
  }

  // -- open verification popup
  @ViewChild('otpVerificationPopup') otpVerificationPopup: PopupComponent;
  openOtpVerificationPopup() {
    const contact = this.countryCode.toString() + this.fc.mobileNumber?.value;

    if (contact.toString().trim().length === 0) {
      let errorMessage = 'Please enter a valid Mobile number to verify';
      this.otpForm.reset();
      this.otpForm.get('codeDigit')?.reset();
      this.swalService.error('Verification Failed', errorMessage);

      return;
    }

    this.contactVerificationService
      .generateOtp(contact, 'PHONE')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        if (res.status === 'SUCCESS') {
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
                  return true;
                },
              },
              data: {
                title: 'Verify Mobile Number',
                showFooter: false,
              },
            })
            .then((res) => ''); // // console.log(res));

          this.toastrService.success('OTP sent successfully', 'Success');
        } else {
          this.toastrService.error('OTP not sent', 'Error');
        }
      });
  }

  editContact() {
    this.fc.mobileNumber.enable();
    this.fc.verificationStatus?.setValue('NOT_VERIFIED');
    this.mobileVerified.emit(false);
  }

  reGenerateOtp() {}

  @ViewChild('mobileNumber') mobileNumber: ElementRef<HTMLInputElement>;
  verifyContact() {
    const codeDigit = this.otpForm.get('codeDigit')!;

    this.contactVerificationService
      .validateContact(`${codeDigit.value}`, 'PHONE')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        // this.otpVerificationPopup.close();

        let swalMessageTxt = 'Mobile Number verified successfully!';

        if (res.status === 'SUCCESS') {
          Swal.fire({
            title: 'Success',
            text: swalMessageTxt,
            icon: 'success',
            heightAuto: false,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.otpVerificationPopup.close();
              this.fc.mobileNumber?.disable();
              this.fc.verificationStatus?.setValue('VERIFIED');
              this.mobileNumber.nativeElement.classList.add('mobile-verified');
              this.cdr.markForCheck();
            }

            this.otpForm.reset();
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Invalid OTP',
            heightAuto: false,
            icon: 'error',
          }).then((result) => {
            if (result.isConfirmed) {
              this.mobileNumber.nativeElement.classList.remove('mobile-verified');
              this.otpForm.reset();
              this.otpForm.get('codeDigit')?.reset();
            }
          });
        }
      });
  }
}
