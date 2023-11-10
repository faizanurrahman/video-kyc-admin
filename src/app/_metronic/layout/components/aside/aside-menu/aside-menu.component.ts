import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { environment } from '../../../../../../environments/environment';
import { UserInnerComponent } from '../../../../partials/layout/extras/dropdown-inner/user-inner/user-inner.component';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    NgIf,
    UserInnerComponent,
    InlineSVGModule,
  ],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;


  constructor() {}

  ngOnInit(): void {}
}
