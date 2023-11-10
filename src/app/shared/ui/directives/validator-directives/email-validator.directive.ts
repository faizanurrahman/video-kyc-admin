import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appEmailValidator]',
})
export class EmailValidatorDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    this.validateEmail();
  }

  private validateEmail() {
    const inputValue = this.el.nativeElement.value;
    const isValid = /(?:\w{3,})[\@][\w]+([.]{1}[\w]{2,}){1,}\b/.test(inputValue);

    if (isValid) {
      this.control.control?.setErrors(null);
      this.el.nativeElement.style.border = '1px solid #ccc';
    } else {
      this.control.control?.setErrors({ invalidEmail: true });
      this.el.nativeElement.style.border = '1px solid red';
    }
  }
}
