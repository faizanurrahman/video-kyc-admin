import { NgIf } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { ClickableDirective } from '../../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { ClickableSvgDirective } from '../../../../../shared/ui/directives/dom-event-directives/clickable-svg-icon.directives';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss'],
  standalone: true,
  imports: [ClickableSvgDirective, ClickableDirective, NgIf],
})
export class OfferCardComponent {
  @HostBinding('class') classes = 'w-100 h-100';
}
