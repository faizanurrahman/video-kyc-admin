import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDigitOnly]',
  standalone: true,
})
export class DigitOnlyDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if the pressed key is not a digit or the backspace/delete key
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
