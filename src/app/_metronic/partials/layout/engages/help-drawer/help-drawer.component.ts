import {Component, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';
import { RouterLink } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-help-drawer',
  templateUrl: './help-drawer.component.html',
  standalone: true,
  imports: [InlineSVGModule, RouterLink],
})
export class HelpDrawerComponent implements OnInit {
  appThemeName: string = environment.appThemeName;
  appPurchaseUrl: string = environment.appPurchaseUrl;

  constructor() {
  }

  ngOnInit(): void {
  }
}
