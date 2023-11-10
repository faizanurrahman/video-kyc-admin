import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  public static mobileNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const mobileNumber = control.value;
      const regex = /^7\d{3}\d{4}$/; // pattern for a 10-digit mobile number
      const valid = regex.test(mobileNumber);
      return valid ? null : { invalidMobileNumber: { value: control.value } };
    };
  }

  public static emailAddressValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // // console.log('Inside Email Address: ', control);

      const email = control.value;
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // pattern for a valid email address
      const valid = regex.test(email);
      return valid ? null : { invalidEmailAddress: { value: control.value } };
    };
  }

  public static firstLetterCapitalizedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (!value) {
        // Return null if value is empty or null
        return null;
      }

      const firstLetter = value.charAt(0);

      if (this.isDecimalValue(value)) {
        return { firstLetterCapitalized: true };
      }

      if (firstLetter !== value.charAt(0).toUpperCase()) {
        // console.log('first latter is not captelized');
        // Return an object with an error key and a value of true
        return { firstLetterCapitalized: true };
      }

      // Return null if the first letter is capitalized
      return null;
    };
  }

  public static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Define the required criteria for the password
    // const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*.])(.{6,})$/;
    const pattern =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#`~|$%^&*()\-_=+[{\]}\\|;:'",<.>/?]).{6,}$/;

    // Test the input value against the pattern
    const valid = pattern.test(value);

    // If the input value is valid, return null
    if (valid) {
      return null;
    }

    // Otherwise, return an object with an error message
    return {
      password:
        'Your password should include at least one uppercase letter, one lowercase letter, one digit, and one of the special characters from the standard keyboard, such as: !, @, #, $, %, ^, &, ., *',
    };
  }

  public static isNumericKeyPress(event: KeyboardEvent) {
    const pattern = /[0-9\+\-\. ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public static isNegativeValue(value: string) {
    return value.startsWith('-');
  }

  public static isDecimalValue(value: string) {
    return value.includes('.');
  }

  public static isNumber(value: string) {
    return !isNaN(Number(value));
  }

  public static isNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = !isNaN(Number(value));
      return valid ? null : { invalidNumber: { value: control.value } };
    };
  }

  public static isNumberOrDecimalValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = !isNaN(Number(value)) || value.includes('.');
      return valid ? null : { invalidNumberOrDecimal: { value: control.value } };
    };
  }

  public static isNegativeNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = !isNaN(Number(value)) && value.startsWith('-');
      return valid ? null : { invalidNegativeNumber: { value: control.value } };
    };
  }
}
