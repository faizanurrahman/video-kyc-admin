import { Component, OnInit } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-advance-tables-widget2',
  templateUrl: './advance-tables-widget2.component.html',
  standalone: true,
  imports: [InlineSVGModule],
})
export class AdvanceTablesWidget2Component implements OnInit {
  currentTab = 'Day';

  constructor() {}

  ngOnInit(): void {}

  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }
}
