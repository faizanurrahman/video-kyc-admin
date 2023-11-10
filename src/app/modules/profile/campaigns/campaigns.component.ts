import { Component } from '@angular/core';
import { Card5Component } from '../../../_metronic/partials/content/cards/card5/card5.component';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  standalone: true,
  imports: [Card5Component],
})
export class CampaignsComponent {
  constructor() {}
}
