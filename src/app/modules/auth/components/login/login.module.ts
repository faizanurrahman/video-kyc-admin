import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import {
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings,
  RECAPTCHA_SETTINGS,
} from 'ng-recaptcha';
import { environment } from '../../../../../environments/environment';

import { InputModule } from '../../../../shared/ui/components/input/input.module';
import { NotificationModule } from '../../../../shared/ui/components/notification/notification.module';

import { LoginFormComponent } from './login-form/login-form.component';

import { GoogleCaptchaComponent } from './google-captcha/google-captcha.component';
import { LoginComponent } from './login.component';
import { PasswordVisibilityDirective } from './password-visibility.directive';

const routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent,
    PasswordVisibilityDirective,
    GoogleCaptchaComponent,
  ],
  imports: [
    CommonModule,
    NotificationModule,
    // RecaptchaV3Module,
    RecaptchaModule,
    RecaptchaFormsModule,

    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    InlineSVGModule,
    InputModule,
  ],
  exports: [LoginComponent],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
  ],
})
export class LoginModule {

}
