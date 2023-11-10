import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-preview-feedback',
  templateUrl: './preview-feedback.component.html',
  styleUrls: ['./preview-feedback.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PreviewFeedbackComponent {

}
