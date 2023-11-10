import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector:
    '[telephoneNumber][ngModel],[telephoneNumber][formControl],[telephoneNumber][formControlName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TelephoneNumberValidatorDirective,
      multi: true,
    },
  ],

  exportAs: 'telephoneNumber',
})
export class TelephoneNumberValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) {
      // If the control is empty, consider it as valid (use required validator for this)
      return null;
    }

    // Regular expression to match a telephone number (example pattern for US numbers)
    const telephoneNumberRegex = /^\+?(\d{1,3})?[ -]?\(?(\d{3})\)?[ -]?(\d{3})[ -]?(\d{4})$/;

    // Use the test() method to check if the input matches the regex
    const valid = telephoneNumberRegex.test(control.value);

    // Return the validation result
    return valid ? null : { invalidTelephoneNumber: true };
  }
}
