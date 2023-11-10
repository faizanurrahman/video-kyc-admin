import { Component, OnInit } from '@angular/core';
import { TablesWidget13Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget13/tables-widget13.component';
import { TablesWidget12Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget12/tables-widget12.component';
import { TablesWidget11Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget11/tables-widget11.component';
import { TablesWidget9Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget9/tables-widget9.component';
import { TablesWidget8Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget8/tables-widget8.component';
import { TablesWidget7Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget7/tables-widget7.component';
import { TablesWidget6Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget6/tables-widget6.component';
import { TablesWidget5Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget5/tables-widget5.component';
import { TablesWidget4Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget4/tables-widget4.component';
import { TablesWidget3Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget3/tables-widget3.component';
import { TablesWidget2Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget2/tables-widget2.component';
import { TablesWidget1Component } from '../../../_metronic/partials/content/widgets/tables/tables-widget1/tables-widget1.component';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  standalone: true,
  imports: [
    TablesWidget1Component,
    TablesWidget2Component,
    TablesWidget3Component,
    TablesWidget4Component,
    TablesWidget5Component,
    TablesWidget6Component,
    TablesWidget7Component,
    TablesWidget8Component,
    TablesWidget9Component,
    TablesWidget11Component,
    TablesWidget12Component,
    TablesWidget13Component,
  ],
})
export class TablesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
