import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomValidators } from '../../../utils/custom-validators';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
    {
      provide: Validators,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
})
export class OtpInputComponent
  implements OnDestroy, ControlValueAccessor, Validators, OnInit, AfterViewInit
{
  @Input() otpType: any | 'NONE' = 'NONE';
  @Input() numberOfInputs: number = 4;

  @ViewChildren('digit') digitInputs: QueryList<ElementRef>;

  private _disabled: boolean;
  private _value: string;
  private _onChange: (_: any) => void;
  private _onTouched: () => void;

  otpForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private destroyRef: DestroyRef) {
    // this.otpForm = this.formBuilder.group(
    //   {
    //     firstDigit: [
    //       '',
    //       Validators.compose([
    //         Validators.required,
    //         Validators.minLength(1),
    //         Validators.maxLength(1),
    //         Validators.pattern('[0-9]*'),
    //       ]),
    //     ],
    //     secondDigit: [
    //       '',
    //       Validators.compose([
    //         Validators.required,
    //         Validators.minLength(1),
    //         Validators.maxLength(1),
    //         Validators.pattern('[0-9]*'),
    //       ]),
    //     ],
    //     thirdDigit: [
    //       '',
    //       Validators.compose([
    //         Validators.required,
    //         Validators.minLength(1),
    //         Validators.maxLength(1),
    //         Validators.pattern('[0-9]*'),
    //       ]),
    //     ],
    //     fourthDigit: [
    //       '',
    //       Validators.compose([
    //         Validators.required,
    //         Validators.minLength(1),
    //         Validators.maxLength(1),
    //         Validators.pattern('[0-9]*'),
    //       ]),
    //     ],
    //   },
    //   {
    //     updateOn: 'change',
    //   },
    // );

    this.otpForm = this.formBuilder.group(
      {
        digits: this.formBuilder.array([]),
      },
      { updateOn: 'change' },
    );
  }

  get otpDigits() {
    if (this.otpForm) {
      return this.otpForm.get('digits') as FormArray;
    }
  }

  ngOnInit() {
    this.createOTPForm(this.numberOfInputs);

    this.otpForm.valueChanges.subscribe((value) => {
      this._value = Object.values(value.digits).join('');
      if (this._onChange) {
        this._onChange(this._value);
      }

      if (this._onTouched) {
        this._onTouched();
      }
    });
  }

  ngAfterViewInit() {
    this.setupFocusChangeListeners();
  }

  ngOnDestroy() {
    // this.otpForm.reset();
  }

  createOTPForm(numberOfInputs: number) {
    const otpFormDigits = this.otpForm.get('digits') as FormArray;
    for (let i = 0; i < numberOfInputs; i++) {
      otpFormDigits.push(this.formBuilder.control('', Validators.required));
    }

    this.otpForm.setControl('digits', otpFormDigits);
  }

  // ================ ControlValueAccessor ================
  writeValue(value: string): void {
    if (value) {
      this._value = value;

      if (!this.otpForm) return;
      this.otpForm.setValue(
        {
          digits: value.split(''),
        },
        { emitEvent: false },
      );
    } else {
      if (!this.otpForm) return;
      // this.otpForm.setValue(
      //   {
      //     digits: ,
      //   },
      //   {
      //     emitEvent: false,
      //   },
      // );
      this.otpForm.reset();
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.otpForm.disable();
    } else {
      this.otpForm.enable();
    }
  }

  // ================ Validators ================

  validate(control: AbstractControl) {
    return null;
  }

  isOtpNumericKeyPress(event: KeyboardEvent) {
    return CustomValidators.isNumericKeyPress(event);

    // if (!pattern.test(inputChar)) {
    //   event.preventDefault();
    //   return;
    // }
  }

  setupFocusChangeListeners() {
    this.digitInputs.forEach((input, index) => {
      const element = input.nativeElement;

      element.addEventListener('keyup', (event: any) => {
        this.moveFocusToNextInputDigitCode(event);
      });
    });
  }

  handleOtpEntry(index: number, currentInput: HTMLInputElement) {
    const inputs = this.digitInputs.toArray();
    const currentInputValue = currentInput.value;

    if (currentInputValue) {
      const nextIndex = index + 1;

      if (nextIndex < inputs.length) {
        const nextInput = inputs[nextIndex].nativeElement;
        nextInput.focus();
      }
    } else {
      const previousIndex = index - 1;

      if (previousIndex >= 0) {
        const previousInput = inputs[previousIndex].nativeElement;
        previousInput.focus();
      }
    }
  }

  // ================== Event Handlers ==================
  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {
  //   event.preventDefault();
  //   if (this.otpType === 'NONE') {
  //     return;
  //   }
  //   this.moveFocusToNextInputDigitCode(event);
  //   // console.log('Event inside the otp form: ', event);
  // }

  public moveFocusToNextInputDigitCode(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const nextInput = target.nextElementSibling as HTMLInputElement;
    const previousInput = target.previousElementSibling as HTMLInputElement;

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
