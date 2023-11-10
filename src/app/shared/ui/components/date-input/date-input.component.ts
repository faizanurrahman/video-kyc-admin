import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent {

}
