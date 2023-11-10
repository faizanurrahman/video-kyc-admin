import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, ReactiveFormsModule],
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor, Validators, OnInit, OnDestroy {
  public passwordFormControl: FormControl;

  @Input() placeholder: string;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public isPasswordVisible: boolean;

  private _value: string;
  private _disable: boolean;

  private onChange: (value: any) => void;
  private onTouched: () => void;
  private onFocus: () => void;

  constructor(private fb: FormBuilder, private destroyRef: DestroyRef) {
    this.passwordFormControl = this.fb.control('', [Validators.required]);
  }

  public passwordInputFocused(event: any) {
    this.focus.emit(event);
  }

  public togglePasswordVisibility(passwordElement: HTMLInputElement) {
    this.isPasswordVisible = !this.isPasswordVisible;

    passwordElement.type = this.isPasswordVisible ? 'text' : 'password';
  }

  writeValue(value: any): void {
    // Write Value will be called when value is set from parent component
    // Disable emitEvent to prevent infinite loop
    this.passwordFormControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    // Register onChange function for parent component
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Set disable state for form control
    if (isDisabled) {
      this.passwordFormControl.disable();
    } else {
      this.passwordFormControl.enable();
    }
  }

  validate(control: FormControl): { [key: string]: any } | null {
    // Validate function will be called when form is submitted
    // Return null if form is valid
    // Return object if form is invalid
    return null;
  }

  ngOnInit(): void {
    this.passwordFormControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (this.onChange) {
          this.onChange(value);
        }

        if (this.onTouched) {
          this.onTouched();
        }
      });
  }

  ngOnDestroy(): void {}
}
