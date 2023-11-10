import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AtleastTwoDigitPipe } from './atleast-two-digit.pipe';

@Component({
  selector: 'app-mini-date',
  templateUrl: './mini-date.component.html',
  styleUrls: ['./mini-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AtleastTwoDigitPipe],
})
export class MiniDateComponent {
  @Input() public day: string;
  @Input() public month: string;
  @Input() public year: string;
}
