import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idFilter',
  standalone: true,
})
export class IdFilterPipe implements PipeTransform {
  transform(items: any[], filterId: number): any[] {
    if (!items || !filterId) items;
    return items.filter((item: any) => item?.individualId === filterId);
  }
}
