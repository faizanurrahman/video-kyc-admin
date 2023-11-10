import { Component, OnInit } from '@angular/core';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-feeds-widget5',
  templateUrl: './feeds-widget5.component.html',
  standalone: true,
  imports: [InlineSVGModule, DropdownMenu1Component],
})
export class FeedsWidget5Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
