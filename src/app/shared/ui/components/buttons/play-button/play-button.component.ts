import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-play-button',
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class PlayButtonComponent {

  @Input() public classes: string = 'svg-icon-4x';
}
