import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent {
  currentIndex = signal(0, { equal: (a, b) => a === b });

  constructor() {}
}
