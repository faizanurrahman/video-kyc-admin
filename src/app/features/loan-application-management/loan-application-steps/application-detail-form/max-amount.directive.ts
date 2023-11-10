import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxAmount]',
  standalone: true,
})
export class MaxAmountDirective {
  @Input() maxAmount: string = '5000000'; // 50 million = 50000000

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // console.log('max amount allowed: ', this.maxAmount);
    // Remove commas from the input value
    const sanitizedValue = value.replace(/,/g, '');
    this.maxAmount = this.maxAmount.replace(/,/g, '');
    const parsedMaxAmount = parseFloat(this.maxAmount);

    // Parse the sanitized value as a number
    const parsedValue = parseFloat(sanitizedValue);

    // Check if the parsed value exceeds the maximum allowed amount
    if (parsedValue > parsedMaxAmount) {
      // If the value exceeds the maximum, set the input value to the maximum allowed amount
      this.el.nativeElement.value = parsedMaxAmount;
    }
  }
}
