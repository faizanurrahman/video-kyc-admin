import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-explore-main-drawer',
  templateUrl: './explore-main-drawer.component.html',
  standalone: true,
  imports: [InlineSVGModule, NgFor, NgIf, KeyValuePipe],
})
export class ExploreMainDrawerComponent implements OnInit {
  appThemeName: string = '';
  appPurchaseUrl: string = '';
  appPreviewUrl: string = '';
  appDemos = '';

  constructor() {}

  ngOnInit(): void {}
}
