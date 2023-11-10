import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapitalizeFirstTwo]',
  standalone: true,
})
export class CapitalizeFirstTwoDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const inputValue: string = event.target.value;
    if (inputValue.length >= 2) {
      event.target.value = inputValue.substring(0, 2).toUpperCase() + inputValue.substring(2);
    } else {
      event.target.value = inputValue.toUpperCase();
    }
  }
}
