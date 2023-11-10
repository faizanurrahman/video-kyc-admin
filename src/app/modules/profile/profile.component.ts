import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenu1Component } from '../../_metronic/partials/content/dropdown-menus/dropdown-menu1/dropdown-menu1.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [InlineSVGModule, DropdownMenu1Component, RouterLink, RouterLinkActive, RouterOutlet],
})
export class ProfileComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
