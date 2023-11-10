import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  static MatchPassword(control: AbstractControl): any {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('cPassword')?.value;

    if (password !== confirmPassword) {
      return {
        passwordMismatch: true,
      };
    }

    return null;
  }

  static MatchPassword2(control: AbstractControl) {
    const password1 = control.get('password1')?.value;
    const password2 = control.get('password2')?.value;

    if (password1 !== password2) {
      control.get('password2')?.setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}
