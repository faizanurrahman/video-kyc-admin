import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[mobileNumber][ngModel],[mobileNumber][formControl],[mobileNumber][formControlName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MobileNumberValidatorDirective,
      multi: true,
    },
  ],
})
export class MobileNumberValidatorDirective implements Validator {
  @Input() phoneNumber: string; // Use this input to pass the country code or any specific phone number format

  validate(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) {
      // If the control is empty, consider it as valid (use required validator for this)
      return null;
    }

    // Regular expression to match a phone number
    const phoneNumberRegex = /^\+?[0-9]{8,}$/;

    // Use the test() method to check if the input matches the regex
    const valid = phoneNumberRegex.test(control.value);

    // Return the validation result
    return valid ? null : { invalidMobileNumber: true };
  }
}
