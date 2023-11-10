import { Component } from '@angular/core';
import { Card1Component } from '../../../_metronic/partials/content/cards/card1/card1.component';
import { Card2Component } from '../../../_metronic/partials/content/cards/card2/card2.component';
import { Card3Component } from '../../../_metronic/partials/content/cards/card3/card3.component';
import { Card4Component } from '../../../_metronic/partials/content/cards/card4/card4.component';
import { Card5Component } from '../../../_metronic/partials/content/cards/card5/card5.component';
import { UserListComponent } from '../../../_metronic/partials/content/cards/user-list/user-list.component';

@Component({
  selector: 'app-cards-example',
  templateUrl: './cards.component.html',
  imports: [
    Card1Component,
    Card2Component,
    Card3Component,
    Card4Component,
    Card5Component,
    UserListComponent,
  ],
  standalone: true,
})
export class CardsComponent {}
