import { Component } from '@angular/core';
import { MixedWidget11Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget11/mixed-widget11.component';
import { MixedWidget10Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget10/mixed-widget10.component';
import { MixedWidget9Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget9/mixed-widget9.component';
import { MixedWidget8Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget8/mixed-widget8.component';
import { MixedWidget7Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget7/mixed-widget7.component';
import { MixedWidget6Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget6/mixed-widget6.component';
import { MixedWidget5Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget5/mixed-widget5.component';
import { MixedWidget4Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget4/mixed-widget4.component';
import { MixedWidget3Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget3/mixed-widget3.component';
import { MixedWidget2Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget2/mixed-widget2.component';
import { MixedWidget1Component } from '../../../_metronic/partials/content/widgets/mixed/mixed-widget1/mixed-widget1.component';

@Component({
  selector: 'app-mixed',
  templateUrl: './mixed.component.html',
  standalone: true,
  imports: [
    MixedWidget1Component,
    MixedWidget2Component,
    MixedWidget3Component,
    MixedWidget4Component,
    MixedWidget5Component,
    MixedWidget6Component,
    MixedWidget7Component,
    MixedWidget8Component,
    MixedWidget9Component,
    MixedWidget10Component,
    MixedWidget11Component,
  ],
})
export class MixedComponent {
  constructor() {}
}
