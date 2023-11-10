import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: string): Date {
    if (!value) return new Date();

    const dateParts = value.split(' ');
    const date = dateParts[0];
    const time = dateParts[1];

    const [day, month, year] = date.split('/');
    const [hour, minute, second] = time.split(':');

    const transformDate = new Date(`${month}/${day}/${year} ${hour}:${minute}:${second}`);

    // return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    return transformDate;
  }
}
