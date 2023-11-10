import { Component, OnInit } from '@angular/core';
import { DropdownMenu2Component } from '../../../dropdown-menus/dropdown-menu2/dropdown-menu2.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-tables-widget12',
  templateUrl: './tables-widget12.component.html',
  standalone: true,
  imports: [InlineSVGModule, DropdownMenu2Component],
})
export class TablesWidget12Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
