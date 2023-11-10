import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFirstLetterCapitalize]',
  standalone: true,
})
export class AppFirstLetterCapitalizeDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const capitalizedValue = this.capitalizeFirstLetter(inputValue);
    this.renderer.setProperty(inputElement, 'value', capitalizedValue);
  }

  private capitalizeFirstLetter(input: string): string {
    if (input.length === 0) {
      return input;
    }
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
}
