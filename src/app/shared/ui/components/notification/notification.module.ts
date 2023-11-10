import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NotificationComponent } from './notification.component';

@NgModule({
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot({
      provideSwal: () => import('sweetalert2/dist/sweetalert2.js'),
    }),
    NotificationComponent,
  ],
  exports: [NotificationComponent],
})
export class NotificationModule {
  constructor() {
    // // console.log('%cNotificationModule Loaded', 'color: #0f0; font-size: 20px; font-weight: bold;');
  }
}
