import { Pipe, PipeTransform } from '@angular/core';
// import {DatePipe} from "@angular/common";

@Pipe({
  name: 'formatDate',

  pure: false,
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  constructor() {}
  // Transform Values
  transform(value: string): string {
    const date = new Date(value);
    return date.toLocaleDateString();
  }
}
