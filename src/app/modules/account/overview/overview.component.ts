import { Component, OnInit } from '@angular/core';
import { TablesWidget5Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget5/tables-widget5.component';
import { ListsWidget5Component } from '../../../_metronic/partials/content/widgets/lists/lists-widget5/lists-widget5.component';
import { TablesWidget1Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget1/tables-widget1.component';
import { ChartsWidget1Component } from '../../../_metronic/partials/content/widgets/charts/charts-widget1/charts-widget1.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  standalone: true,
  imports: [
    RouterLink,
    InlineSVGModule,
    ChartsWidget1Component,
    TablesWidget1Component,
    ListsWidget5Component,
    TablesWidget5Component,
  ],
})
export class OverviewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
