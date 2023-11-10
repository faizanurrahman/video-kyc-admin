import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RecaptchaSettings } from 'ng-recaptcha';

@Component({
  selector: 'app-google-captcha',
  templateUrl: './google-captcha.component.html',
  styleUrls: ['./google-captcha.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GoogleCaptchaComponent),
      multi: true,
    },
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: forwardRef(() => GoogleCaptchaComponent),
    //   multi: true,
    // },
  ],
})
export class GoogleCaptchaComponent implements ControlValueAccessor {
  // Holds the value of the control
  private innerValue: any;
  private disabled: any;
  // Event emitters for the control
  private onTouchedCallback: () => void;
  private onChangeCallback: (_: any) => void;

  // Form Control
  // protected control: FormControl;
  // @Input() formControlName: string;

  customTheme: RecaptchaSettings = {
    theme: 'dark',
    type: 'audio',
    size: 'invisible',
    badge: 'bottomleft',
  };

  //getter and setter
  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    // // console.log('writeValue: ' + value + ' ' + this.innerValue);
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  resolved(captchaResponse: string) {
    // // console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.value = captchaResponse;
  }
}
