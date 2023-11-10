import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationModule } from '../../../../shared/ui/components/notification/notification.module';

import { LogoutComponent } from './logout.component';

@NgModule({
  imports: [
    CommonModule,
    NotificationModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: LogoutComponent }]),
    LogoutComponent,
  ],
  exports: [LogoutComponent],
})
export class LogoutModule {
  constructor() {
    // // console.log('%cLogout Module Loaded', 'color: #ae0221; font-weight: bold; font-size: 1.8rem;');
  }
}
