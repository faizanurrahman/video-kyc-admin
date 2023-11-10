import {Component, OnInit} from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-explore-main-drawer',
  templateUrl: './explore-main-drawer.component.html',
  standalone: true,
  imports: [
    InlineSVGModule,
    NgFor,
    NgIf,
    KeyValuePipe,
  ],
})
export class ExploreMainDrawerComponent implements OnInit {
  appThemeName: string = environment.appThemeName;
  appPurchaseUrl: string = environment.appPurchaseUrl;
  appPreviewUrl: string = environment.appPreviewUrl;
  appDemos = environment.appDemos;

  constructor() {
  }

  ngOnInit(): void {
  }
}
