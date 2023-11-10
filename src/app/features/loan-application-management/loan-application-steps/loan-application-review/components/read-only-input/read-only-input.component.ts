import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'review-read-only-input',
  standalone: true,
  imports: [],
  templateUrl: './read-only-input.component.html',
  styleUrls: ['./read-only-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadOnlyInputComponent {
  @Input() label: string;
  @Input() value: any;
}
