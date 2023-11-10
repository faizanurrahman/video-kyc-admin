import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-play-button-secondary',
  templateUrl: './play-button-secondary.component.html',
  styleUrls: ['./play-button-secondary.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class PlayButtonSecondaryComponent {
  @Input() public classes: string = 'svg-icon-4x';
}
