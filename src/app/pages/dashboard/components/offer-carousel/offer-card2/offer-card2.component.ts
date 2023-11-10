import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ClickableDirective } from '../../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';

@Component({
  selector: 'app-offer-card2',
  templateUrl: './offer-card2.component.html',
  styleUrls: ['./offer-card2.component.scss'],
  standalone: true,
  imports: [NgIf, ClickableDirective],
})
export class OfferCard2Component {}
