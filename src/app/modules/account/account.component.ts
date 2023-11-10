import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DropdownMenu1Component } from '../../_metronic/partials/content/dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  standalone: true,
  imports: [
    InlineSVGModule,
    DropdownMenu1Component,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class AccountComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
