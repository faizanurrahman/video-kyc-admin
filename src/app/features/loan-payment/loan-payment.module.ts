import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {LoanPaymentCallbackComponent} from './loan-payment-callback/loan-payment-callback.component';
import {LoanPaymentComponent} from './loan-payment.component';
import {LoanPaymentSuccessComponent} from './loan-payment-success/loan-payment-success.component';
import {LoanPaymentFailureComponent} from './loan-payment-failure/loan-payment-failure.component';
import {InlineSVGModule} from 'ng-inline-svg-2';

const routes: Routes = [
  {
    path: '',
    component: LoanPaymentComponent,
  },
  {
    path: 'loan-pay',
    component: LoanPaymentComponent,
  },
  {
    path: 'loan-payment/:requestId/:response',
    component: LoanPaymentCallbackComponent,
  },
  {
    path: 'response/success',
    component: LoanPaymentSuccessComponent,
  },
  {
    path: 'response/failure',
    component: LoanPaymentFailureComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    InlineSVGModule,
    LoanPaymentComponent, LoanPaymentCallbackComponent, LoanPaymentSuccessComponent, LoanPaymentFailureComponent,
  ],
})
export class LoanPaymentModule {
}
