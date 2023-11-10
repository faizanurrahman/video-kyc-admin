import { Component } from '@angular/core';
import { ListsWidget2Component } from '../../../_metronic/partials/content/widgets/lists/lists-widget2/lists-widget2.component';
import { ListsWidget5Component } from '../../../_metronic/partials/content/widgets/lists/lists-widget5/lists-widget5.component';
import { ChartsWidget1Component } from '../../../_metronic/partials/content/widgets/charts/charts-widget1/charts-widget1.component';
import { FeedsWidget6Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget6/feeds-widget6.component';
import { FeedsWidget5Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget5/feeds-widget5.component';
import { FeedsWidget4Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget4/feeds-widget4.component';
import { FeedsWidget3Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget3/feeds-widget3.component';
import { FeedsWidget2Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget2/feeds-widget2.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  standalone: true,
  imports: [
    FeedsWidget2Component,
    FeedsWidget3Component,
    FeedsWidget4Component,
    FeedsWidget5Component,
    FeedsWidget6Component,
    ChartsWidget1Component,
    ListsWidget5Component,
    ListsWidget2Component,
  ],
})
export class OverviewComponent {
  constructor() {}
}
