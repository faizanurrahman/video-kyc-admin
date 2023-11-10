import { Component, OnInit } from '@angular/core';
import { FeedsWidget6Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget6/feeds-widget6.component';
import { FeedsWidget5Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget5/feeds-widget5.component';
import { FeedsWidget4Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget4/feeds-widget4.component';
import { FeedsWidget3Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget3/feeds-widget3.component';
import { FeedsWidget2Component } from '../../../_metronic/partials/content/widgets/feeds/feeds-widget2/feeds-widget2.component';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  standalone: true,
  imports: [
    FeedsWidget2Component,
    FeedsWidget3Component,
    FeedsWidget4Component,
    FeedsWidget5Component,
    FeedsWidget6Component,
  ],
})
export class FeedsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
