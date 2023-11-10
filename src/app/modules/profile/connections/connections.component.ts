import { Component } from '@angular/core';
import { Card3Component } from '../../../_metronic/partials/content/cards/card3/card3.component';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  standalone: true,
  imports: [Card3Component],
})
export class ConnectionsComponent {
  constructor() {}
}
