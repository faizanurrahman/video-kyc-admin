import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArray',
  standalone: true,
})
export class SortArrayPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!array || !field) {
      return array;
    }

    return array.slice().sort((a, b) => {
      if (a[field] < b[field]) {
        return 1;
      }
      if (a[field] > b[field]) {
        return -1;
      }
      return 0;
    });
  }
}
