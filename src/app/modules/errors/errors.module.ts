import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ErrorsComponent } from '../errors/errors.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { ErrorsRoutingModule } from './errors-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    ErrorsComponent,
    Error404Component,
    Error500Component,
  ],
})
export class ErrorsModule {
  constructor() {
    // // console.log('%cErrorsModule Loaded', 'color: #0f0; font-size: 20px; font-weight: bold;');
  }
}
