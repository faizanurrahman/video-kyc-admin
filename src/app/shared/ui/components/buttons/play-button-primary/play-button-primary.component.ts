import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-play-button-primary',
  templateUrl: './play-button-primary.component.html',
  styleUrls: ['./play-button-primary.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class PlayButtonPrimaryComponent {
  @Input() public classes: string = 'svg-icon-4x';
}
