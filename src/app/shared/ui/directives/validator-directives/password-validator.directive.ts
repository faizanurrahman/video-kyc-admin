import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPasswordValidator]',
})
export class PasswordValidatorDirective {
  @Input() invalidPasswordMessage: string = 'Invalid password.';

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    this.validatePassword();
  }

  private validatePassword() {
    const inputValue = this.el.nativeElement.value;

    // Customize your password validation criteria here
    const hasMinimumLength = inputValue.length >= 8;
    const hasUppercaseLetter = /[A-Z]/.test(inputValue);
    const hasLowercaseLetter = /[a-z]/.test(inputValue);
    const hasDigit = /\d/.test(inputValue);
    const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~`\-=/\\|]/.test(inputValue);

    const isValid =
      hasMinimumLength &&
      hasUppercaseLetter &&
      hasLowercaseLetter &&
      hasDigit &&
      hasSpecialCharacter;

    if (isValid) {
      this.control.control?.setErrors(null);
      this.el.nativeElement.style.border = '1px solid #ccc';
    } else {
      this.control.control?.setErrors({ invalidPassword: true });
      this.el.nativeElement.style.border = '1px solid red';
    }
  }
}
