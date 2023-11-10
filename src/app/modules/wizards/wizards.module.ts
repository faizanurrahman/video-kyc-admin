import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { Step1Component } from './steps/step1/step1.component';
import { Step2Component } from './steps/step2/step2.component';
import { Step3Component } from './steps/step3/step3.component';
import { Step4Component } from './steps/step4/step4.component';
import { Step5Component } from './steps/step5/step5.component';
import { VerticalComponent } from './vertical/vertical.component';
import { WizardsRoutingModule } from './wizards-routing.module';
import { WizardsComponent } from './wizards.component';

@NgModule({
  imports: [
    CommonModule,
    WizardsRoutingModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    HorizontalComponent,
    VerticalComponent,
    WizardsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
  ],
})
export class WizardsModule {
  constructor() {
    // // console.log('%cWizardsModule Loaded', 'color: #0f0; font-size: 20px; font-weight: bold;');
  }
}
