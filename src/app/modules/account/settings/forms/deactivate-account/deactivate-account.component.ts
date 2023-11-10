import { Component } from '@angular/core';

@Component({
  selector: 'app-deactivate-account',
  templateUrl: './deactivate-account.component.html',
  standalone: true,
})
export class DeactivateAccountComponent {
  constructor() {}

  saveSettings() {
    alert('Account has been successfully deleted!');
  }
}
