import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDecimalInput]',
  standalone: true,
})
export class DecimalInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;

    // Remove any non-numeric and non-decimal characters
    const sanitizedValue = inputValue.replace(/[^0-9.]/g, '');

    // Split the value by the decimal point
    const parts = sanitizedValue.split('.');

    // Keep only the first part (integer part) and the second part (decimal part)
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1] : '';

    // Limit the decimal part to two digits
    const limitedDecimalPart = decimalPart.substring(0, 2);

    // Construct the new value with the appropriate decimal point and zero-padding
    const newValue = `${integerPart}.${limitedDecimalPart.padEnd(2, '0')}`;

    // Set the new value back to the input element
    inputElement.value = newValue;
  }
}
