import { Component } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-tables-widget2',
  templateUrl: './tables-widget2.component.html',
  standalone: true,
  imports: [InlineSVGModule, DropdownMenu1Component],
})
export class TablesWidget2Component {
  constructor() {}
}
