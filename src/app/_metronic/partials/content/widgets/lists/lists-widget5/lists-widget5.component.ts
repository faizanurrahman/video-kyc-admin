import { Component } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-lists-widget5',
  templateUrl: './lists-widget5.component.html',
  standalone: true,
  imports: [InlineSVGModule, DropdownMenu1Component],
})
export class ListsWidget5Component {
  constructor() {}
}
