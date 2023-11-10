import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'atleastTwoDigit',
  standalone: true,
})
export class AtleastTwoDigitPipe implements PipeTransform {
  transform(value: string): string {
    if (value === undefined || value === null) {
      return '--';
    }

    if (value.length === 1) {
      return '0' + value;
    }
    return value;
  }
}
