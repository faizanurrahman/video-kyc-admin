import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { AccountComponent } from '../account/account.component';
import { AccountRoutingModule } from './account-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { ConnectedAccountsComponent } from './settings/forms/connected-accounts/connected-accounts.component';
import { DeactivateAccountComponent } from './settings/forms/deactivate-account/deactivate-account.component';
import { EmailPreferencesComponent } from './settings/forms/email-preferences/email-preferences.component';
import { NotificationsComponent } from './settings/forms/notifications/notifications.component';
import { ProfileDetailsComponent } from './settings/forms/profile-details/profile-details.component';
import { SignInMethodComponent } from './settings/forms/sign-in-method/sign-in-method.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    InlineSVGModule,
    AccountComponent,
    OverviewComponent,
    SettingsComponent,
    ProfileDetailsComponent,
    ConnectedAccountsComponent,
    DeactivateAccountComponent,
    EmailPreferencesComponent,
    NotificationsComponent,
    SignInMethodComponent,
  ],
})
export class AccountModule {
  constructor() {
    // // console.log('%cAccountModule Loaded', 'color: #0f0; font-size: 20px; font-weight: bold;');
  }
}
