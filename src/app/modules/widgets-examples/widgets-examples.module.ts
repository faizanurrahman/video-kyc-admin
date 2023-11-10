import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChartsComponent } from './charts/charts.component';
import { FeedsComponent } from './feeds/feeds.component';
import { ListsComponent } from './lists/lists.component';
import { MixedComponent } from './mixed/mixed.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TablesComponent } from './tables/tables.component';
import { WidgetsExamplesRoutingModule } from './widgets-examples-routing.module';
import { WidgetsExamplesComponent } from './widgets-examples.component';

@NgModule({
  imports: [
    CommonModule,
    WidgetsExamplesRoutingModule,
    WidgetsExamplesComponent,
    ListsComponent,
    StatisticsComponent,
    ChartsComponent,
    MixedComponent,
    TablesComponent,
    FeedsComponent,
  ],
})
export class WidgetsExamplesModule {
  constructor() {
    // // console.log(
    //   '%cWidgetsExamplesModule Loaded',
    //   'color: #0f0; font-size: 20px; font-weight: bold;'
    // );
  }
}
