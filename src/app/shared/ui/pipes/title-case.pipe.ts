import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase',
  standalone: true,
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string, separator: string = ''): string | null {
    if (value) {
      // replace cedaAdmin to Ceda Admin
      // regex
      return value.toLowerCase();
    }

    return null;
  }
}
