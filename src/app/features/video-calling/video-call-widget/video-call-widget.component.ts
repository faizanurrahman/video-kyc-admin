import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IncomingCallService } from '../services/incoming-call.service';

@Component({
  selector: 'app-video-call-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-call-widget.component.html',
  styleUrls: ['./video-call-widget.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCallWidgetComponent {
  public incomingCallService = inject(IncomingCallService);
}
