import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-calling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-calling.component.html',
  styleUrls: ['./video-calling.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoCallingComponent {

}
