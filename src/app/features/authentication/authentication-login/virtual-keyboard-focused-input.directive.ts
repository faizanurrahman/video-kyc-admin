import { Directive, ElementRef, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VirtualKeyboardService } from './virtual-keyboard.service';

@Directive({
  selector: '[appVirtualKeyboardFocusedInput]',
  standalone: true,
})
export class VirtualKeyboardFocusedInputDirective {
  constructor(
    private el: ElementRef<HTMLInputElement>,
    private keyboardService: VirtualKeyboardService,
    @Self() private ngControl: NgControl, // Inject NgControl

    private toast: ToastrService,
  ) {
    this.keyboardService.allFocusableElement.push(this.el.nativeElement);
  }

  @HostListener('focus', ['$event.target'])
  onFocus(target: HTMLInputElement) {
    this.keyboardService.setFocusedInputElement(target);
    // console.log('current focused element is : ', target);

    // Update the form control's value when the input receives focus
    this.ngControl.control?.setValue(target.value);

    // Update the form control's status
    this.ngControl.control?.updateValueAndValidity();
  }

  @HostListener('change', ['$event.target'])
  onInput(target: HTMLInputElement) {
    // Update the form control's value when the input value changes
    this.ngControl.control?.setValue(target.value);
    // Update the form control's status
    this.ngControl.control?.updateValueAndValidity();
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (this.keyboardService.isKeyboardVisible) {
      event.preventDefault();
      this.toast.info('Please Use Virtual Keyboard');
    }
  }
}
