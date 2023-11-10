import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
// import Swiper core and required components
import SwiperCore, {
  A11y, Autoplay, Controller, Navigation,
  Pagination,
  Scrollbar, Thumbs, Virtual,
  Zoom,
} from 'swiper';
import { OfferCard3Component } from './offer-card3/offer-card3.component';
import { OfferCard2Component } from './offer-card2/offer-card2.component';
import { OfferCardComponent } from './offer-card/offer-card.component';
import { SwiperModule } from 'swiper/angular';

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
]);


@Component({
  selector: 'app-offer-carousel',
  templateUrl: './offer-carousel.component.html',
  styleUrls: ['./offer-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SwiperModule, OfferCardComponent, OfferCard2Component, OfferCard3Component],
})
export class OfferCarouselComponent {
  images = [700, 533, 807, 124].map(n => `https://picsum.photos/id/${n}/900/500`);

  constructor (config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }
}
