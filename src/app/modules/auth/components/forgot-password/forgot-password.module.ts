import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationModule } from '../../../../shared/ui/components/notification/notification.module';
import { VirtualKeyboardModule } from '../../../../shared/ui/components/virtual-keyboard/virtual-keyboard.module';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    NotificationModule,
    VirtualKeyboardModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: ForgotPasswordComponent }]),
  ],
  exports: [ForgotPasswordComponent],
})
export class ForgotPasswordModule {
  constructor() {
    // // console.log('%cForgot Password Module Loaded', 'color: #ae0221; font-weight: bold; font-size: 1.8rem;');
  }
}
