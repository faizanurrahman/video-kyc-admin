import { Component } from '@angular/core';
import { DeactivateAccountComponent } from './forms/deactivate-account/deactivate-account.component';
import { NotificationsComponent } from './forms/notifications/notifications.component';
import { EmailPreferencesComponent } from './forms/email-preferences/email-preferences.component';
import { ConnectedAccountsComponent } from './forms/connected-accounts/connected-accounts.component';
import { SignInMethodComponent } from './forms/sign-in-method/sign-in-method.component';
import { ProfileDetailsComponent } from './forms/profile-details/profile-details.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  imports: [
    ProfileDetailsComponent,
    SignInMethodComponent,
    ConnectedAccountsComponent,
    EmailPreferencesComponent,
    NotificationsComponent,
    DeactivateAccountComponent,
  ],
})
export class SettingsComponent {
  constructor() {}
}
