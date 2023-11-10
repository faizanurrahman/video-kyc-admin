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
import { OtpInputComponent } from '../../../../../shared/ui/components/otp-input/otp-input.component';
import { TelCountryCodeComponent } from '../../../../../shared/ui/components/tel-country-code/tel-country-code.component';
import { DigitOnlyDirective } from '../../../../../shared/ui/directives/dom-event-directives/only-digit-input.directive';
import { PopupComponent } from '../../../../../_metronic/partials/layout/modals/popup/popup.component';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../../../../core/services/sweet-alert.service';
import { LoanApplicationContactVarificationService } from '../../../services/loan-application-contact-varification.service';

@Component({
  selector: 'app-email-id-verification-input',
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
  templateUrl: './email-id-verification-input.component.html',
  styleUrls: ['./email-id-verification-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailIdVerificationInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EmailIdVerificationInputComponent),
      multi: true,
    },
  ],
})
export class EmailIdVerificationInputComponent implements ControlValueAccessor, Validator, OnInit {
  @HostBinding('class') hostClass = 'flex-grow-1';
  @Input({ required: true }) isApplicationDisabled: boolean = false;
  @Input() isDisabled: boolean = false;

  @Output() emailVerified: EventEmitter<boolean> = new EventEmitter();

  emailIdVerifyForm: FormGroup;
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
    this.emailIdVerifyForm = new FormGroup(
      {
        emailId: new FormControl('', [Validators.required]),
        verificationStatus: new FormControl<'VERIFIED' | 'NOT_VERIFIED'>('NOT_VERIFIED', [
          Validators.required,
        ]),
      },
      { updateOn: 'change' },
    );

    this.emailIdVerifyForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        // console.log(value);
        if (value.verificationStatus === 'VERIFIED') {
          this.onChange(this.fc.emailId.getRawValue());
          this.emailVerified.emit(true);
        } else {
          // this.onChange(this.fc.emailId.getRawValue());
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
    // let splitValue = value.split('-');
    // if (splitValue.length === 1) {
    //   this.fc.emailId.setValue(splitValue[0], { emitEvent: false });
    // } else {
    //   this.fc.emailId.setValue(splitValue[1], { emitEvent: false });
    // }
    this.fc.emailId.setValue(value, { emitEvent: true });

    if (this.instanceCount === 1 && value !== '') {
      // console.log('InstanceCount : ', this.instanceCount);
      if (value !== null && value !== undefined && value.toString().length > 1) {
        this.fc.verificationStatus.setValue('VERIFIED');
        this.fc.emailId.disable();
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
      this.onChange(this.fc.emailId.value);
    }
  }

  // ---- fc getter
  get fc() {
    return this.emailIdVerifyForm.controls;
  }

  // --- validation of email id

  isEmailIdValid(emailIdValue: string) {
    if (emailIdValue === null || emailIdValue === undefined || emailIdValue === '') {
      return false;
    }

    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailIdValue);
    return isValid;
  }

  // -- open verification popup
  @ViewChild('otpVerificationPopup') otpVerificationPopup: PopupComponent;
  openOtpVerificationPopup() {
    const contact = this.fc.emailId?.value;

    if (contact.toString().trim().length === 0) {
      let errorMessage = 'Please enter a valid Email Address to verify';
      this.otpForm.reset();
      this.otpForm.get('codeDigit')?.reset();
      this.swalService.error('Verification Failed', errorMessage);

      return;
    }

    this.contactVerificationService
      .generateOtp(contact, 'EMAIL')
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
                title: 'Verify Email Address',
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
    this.fc.emailId.enable();
    this.fc.verificationStatus?.setValue('NOT_VERIFIED');
    this.emailVerified.emit(false);
  }

  reGenerateOtp() {}

  @ViewChild('emailId') emailId: ElementRef<HTMLInputElement>;
  verifyContact() {
    const codeDigit = this.otpForm.get('codeDigit')!;

    this.contactVerificationService
      .validateContact(`${codeDigit.value}`, 'EMAIL')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        // this.otpVerificationPopup.close();

        let swalMessageTxt = 'Email Address verified successfully!';

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
              this.fc.emailId?.disable();
              this.fc.verificationStatus?.setValue('VERIFIED');
              this.emailId.nativeElement.classList.add('email-verified');
              this.cdr.markForCheck();
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
              this.emailId.nativeElement.classList.remove('email-verified');
              this.otpForm.reset();
              this.otpForm.get('codeDigit')?.reset();
            }
          });
        }
      });
  }
}
