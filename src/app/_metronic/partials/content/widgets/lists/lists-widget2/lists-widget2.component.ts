import { Component } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-lists-widget2',
  templateUrl: './lists-widget2.component.html',
  standalone: true,
  imports: [InlineSVGModule, DropdownMenu1Component],
})
export class ListsWidget2Component {
  constructor() {}
}
