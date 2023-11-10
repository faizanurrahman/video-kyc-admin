import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphabetOnly]',
  standalone: true,
})
export class AlphabetOnlyDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if the pressed key is not an alphabet or special keys
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isValidInput = /^[a-zA-Z ]$/.test(event.key);
    if (!isValidInput && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
